package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/elisalimli/nextsync/server/initializers"
	"github.com/elisalimli/nextsync/server/postgres"
	"github.com/go-co-op/gocron"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDatabase()
}

var (
	ctx, scrapedPostCount, layout, previousPostCreatedAt = context.Background(), 0, "02.01.2006 15:04", time.Time{}
)

// Create a custom http.Client with InsecureSkipVerify set to true
var client = &http.Client{
	Transport: &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	},
}

func SavePost(title string, htmlContent *string) {
	user := models.User{Email: os.Getenv("USER_ADMIN_EMAIL")}
	initializers.DB.NewSelect().Model(&user).Scan(ctx)
	post := models.Post{
		Title:       title,
		HtmlContent: htmlContent,
		UserId:      user.Id,
	}

	_, err := initializers.DB.NewInsert().Model(&post).Returning("id").Exec(ctx)
	if err != nil {
		fmt.Println("Error Creating Post ", err)
		return
	}
	tagsRepo := postgres.TagsRepo{DB: initializers.DB}
	// postsTagsRepo := postgres.PostTagsRepo{DB: db}

	tag, err := tagsRepo.GetTagId(ctx, "code", "NEWS")
	fmt.Println("sql result", tag)
	if err != nil {
		fmt.Println("Database error get tag", err)
	}
	postTag := models.PostTag{PostId: post.Id, TagId: tag.Id}
	_, err = initializers.DB.NewInsert().Model(&postTag).Returning("NULL").Exec(ctx)
	if err != nil {
		fmt.Println("Database error creating post tag", err)
	}

	// postsTagsRepo.CreatePostTag(ctx, &postTag)

}

func GetLastScrapedCreatedAt() (time.Time, error) {
	// Read the content of the file
	content, err := os.ReadFile("last_post.txt")
	if err != nil {
		fmt.Println("Error getting lastScrapedCreatedAt : ", err)
		return time.Time{}, err
	}
	previousDateStr := string(content)
	lastPostCreatedAt, err := time.Parse(layout, previousDateStr)
	if err != nil {
		return time.Time{}, nil
	}

	// Convert the content to string and return
	return lastPostCreatedAt, nil
}

func UpdateLastScrapedCreatedAt(postID string) error {
	// Write the post ID to the file
	err := os.WriteFile("last_post.txt", []byte(postID), 0644)
	if err != nil {
		return err
	}

	return nil
}

func ExtractDataFromPage(i int, s *goquery.Selection) bool {
	dateStr := s.Find(".period > :first-child").Text()

	// Parse the date string into a time.Time value
	currentPostCreatedAt, err := time.Parse(layout, dateStr)
	if err != nil {
		// fmt.Println("Error parsing date:", err)
		return false
	}

	// Compare the date with the current time
	if currentPostCreatedAt.After(previousPostCreatedAt) {
		// updating last post's created at
		if scrapedPostCount == 0 {
			UpdateLastScrapedCreatedAt(dateStr)
		}

		fmt.Println("The date is after the current time")
		// fmt.Println(s.Find(".item .body-info .title").Text())
		newHref, ok := s.Find(".item .body-info .title a").Attr("href")

		if ok {
			newsUrl := "https://dim.gov.az" + newHref
			fmt.Println(newsUrl)
			res, err := client.Get(newsUrl)

			if err != nil {
				log.Fatal(err)
			}

			defer res.Body.Close()

			if res.StatusCode != 200 {
				log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
			}

			doc, err := goquery.NewDocumentFromReader(res.Body)
			if err != nil {
				log.Fatal(err)
			}

			title := doc.Find("#pagetitle").Text()
			htmlContent, err := doc.Find(".content").Html()
			if err != nil {
				log.Fatal("Error occured while parsing html", err)
				return false
			}

			SavePost(title, &htmlContent)

			scrapedPostCount += 1
			fmt.Printf("Scraped posts count : %d\n", scrapedPostCount)
		}

	} else {
		// if the post's created_at before the last post's created_at loop should stop
		return true
	}

	return false
}

func PaginatePages(pageNums int) {
	shouldEnd := false
	for i := 1; i <= pageNums; i++ {
		paginatedUrl := "https://www.dim.gov.az/news/index.php?arFilterNews_ff%5BDETAIL_TEXT%5D=&arFilterNews_pf%5BDIRECTION_ACTIVITY%5D=114&arFilterNews_pf%5BTYPE_EVENT%5D=171&set_filter=Y&PAGEN_1=" + strconv.Itoa(i)
		res, err := client.Get(paginatedUrl)

		if err != nil {
			log.Fatal(err)
		}

		defer res.Body.Close()
		if res.StatusCode != 200 {
			log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
		}

		// Load the HTML document
		doc, err := goquery.NewDocumentFromReader(res.Body)
		if err != nil {
			log.Fatal(err)
		}
		doc.Find(".item").Each(func(i int, s *goquery.Selection) {
			shouldEnd =
				ExtractDataFromPage(i, s)
		})
		if shouldEnd {
			break
		}

	}
}

func ScrapePosts() {
	previousPostCreatedAt, _ = GetLastScrapedCreatedAt()

	fmt.Println("----start----")
	res, err := client.Get("https://www.dim.gov.az/news/index.php?arFilterNews_ff%5BDETAIL_TEXT%5D=&arFilterNews_pf%5BDIRECTION_ACTIVITY%5D=114&arFilterNews_pf%5BTYPE_EVENT%5D=171&set_filter=Y&PAGEN_1=1")
	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
	}

	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	pageNums, err := strconv.Atoi(doc.Find(".pagination li:nth-last-child(2)").Text())
	// string to int
	if err == nil {
		PaginatePages(pageNums)
	}
	fmt.Println("----end----")
}

func main() {
	// Create a new scheduler
	s := gocron.NewScheduler(time.UTC)

	// Schedule the cron job to run every day at 17:00 UTC Time
	// So, this will run 20:00 in Baku time
	// s.Every(1).Day().At("16:00").Do(ScrapePosts)
	s.Every(40).Second().Do(ScrapePosts)

	// Start the scheduler
	s.StartBlocking()
}
