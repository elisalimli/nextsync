package cron

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/elisalimli/go_graphql_template/initializers"
)

func ScrapeNews() {
	ctx := context.Background()
	res, err := http.Get("https://www.dim.gov.az/news/index.php?arFilterNews_ff%5BDETAIL_TEXT%5D=&arFilterNews_pf%5BDIRECTION_ACTIVITY%5D=114&arFilterNews_pf%5BTYPE_EVENT%5D=171&set_filter=Y&PAGEN_1=1")
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

	pageNum, err := strconv.Atoi(doc.Find(".pagination li:nth-last-child(2)").Text())
	// string to int
	if err == nil {

		isEnd := false
		for i := 1; i <= pageNum; i++ {
			paginatedUrl := "https://www.dim.gov.az/news/index.php?arFilterNews_ff%5BDETAIL_TEXT%5D=&arFilterNews_pf%5BDIRECTION_ACTIVITY%5D=114&arFilterNews_pf%5BTYPE_EVENT%5D=171&set_filter=Y&PAGEN_1=" + strconv.Itoa(i)
			res, err := http.Get(paginatedUrl)

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
				// fmt.Println(s.Find(".item .body-info .title").Text())

				layout := "02.01.2006 15:04"
				dateStr := s.Find(".period > :first-child").Text()
				currentTime := time.Now().AddDate(0, -1, 0)

				// Parse the date string into a time.Time value
				date, err := time.Parse(layout, dateStr)
				if err != nil {
					// fmt.Println("Error parsing date:", err)
					return
				}

				// Compare the date with the current time
				if !date.Before(currentTime) {
					fmt.Println("The date is after the current time")
					// fmt.Println(s.Find(".item .body-info .title").Text())
					newHref, ok := s.Find(".item .body-info .title a").Attr("href")
					if ok {
						newsUrl := "https://dim.gov.az" + newHref
						fmt.Println(newsUrl)
						res, err := http.Get(newsUrl)
						if err != nil {
							log.Fatal(err)
						}

						defer res.Body.Close()
						if res.StatusCode != 200 {
							log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
						}
						newsDoc, err := goquery.NewDocumentFromReader(res.Body)
						if err != nil {
							log.Fatal(err)
						}

						title := newsDoc.Find("#pagetitle").Text()
						description, err := newsDoc.Find(".content").Html()
						if err != nil {
							log.Fatal("Error occured while parsing html", err)
							return
						}
						fmt.Println("________")
						user := models.User{Email: os.Getenv("USER_ADMIN_EMAIL")}
						initializers.DB.NewSelect().Model(&user).Scan(ctx)
						post := models.Post{
							Title:       title,
							HtmlContent: &description,
							UserId:      user.Id,
						}
						ctx := context.Background()
						_, err = initializers.DB.NewInsert().Model(&post).Returning("id").Exec(ctx)
						if err != nil {
							fmt.Println("error occured while creating post ", err)
							return
						}
						fmt.Println(post, user)
						fmt.Println("title : ", title)
						fmt.Println("description : ", description)
						fmt.Println("________")
					}

				} else {
					isEnd = true
				}
			})

			// doc.Find(".period > :first-child").Each(func(i int, s *goquery.Selection) {
			// 	fmt.Println(s.Text())

			// 		// Find the review items
			// 		s.Find(".item .body-info .title").Each(func(i int, s *goquery.Selection) {
			// 			// For each item found, get the title
			// 		})
			// 	} else {
			// 		isEnd = true
			// 	}

			// })
			if isEnd {
				break
			}

		}

	}

}
