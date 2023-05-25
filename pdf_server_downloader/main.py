import configparser
import json
import uuid
import asyncio
import pandas as pd
import re
import PyPDF2
import pytesseract
from PIL import Image
from pdf2image import convert_from_path

from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from telethon.tl.functions.channels import GetParticipantsRequest
from telethon.tl.types import ChannelParticipantsSearch
from telethon.tl.types import PeerChannel
from telethon import functions, types
import re
import os

# Setting configuration values
api_id = 20406575
api_hash = "7872674cbccb6c9ca945519db1d7e7d3"
api_hash = str(api_hash)
phone = "+994506855619"
username = "elisalimli"

# Create the client and connect
client = TelegramClient(username, api_id, api_hash)


async def main(phone):
    await client.start()
    print("Client Created")
    # Ensure you're authorized
    if await client.is_user_authorized() == False:
        await client.send_code_request(phone)
        try:
            await client.sign_in(phone, input("Enter the code: "))
        except SessionPasswordNeededError:
            await client.sign_in(password=input("Password: "))

    me = await client.get_me()
    i = 1
    start_idx = 0 + 100
    end_idx = 100

    data = []
    async for message in client.iter_messages("https://t.me/BirlikTeam1"):
        # if i < start_idx:
        # i += 1
        # continue
        if not message.document == None:
            date = ""
            variant = ""
            codeVariant = ""
            type = ""
            codeType = ""
            fileName = ""
            grade = 0
            codeGrade = ""
            fileName = str(message.file.name)
            fileExtension = fileName.split(".")[-1]
            if fileExtension == "pdf" and "sınaq" in message.text:
                # extracting date if exists
                pattern = r"\b\d{1,2}\.\d{1,2}\.\d{4}\b"

                match = re.search(pattern, message.text)
                if match:
                    date = match.group(0)
                    print("substring date", date)  # Output: 19.02.2020
                else:
                    print("No date found in the text")

                # extracting the type
                if "Blok" in message.text:
                    if "1-ci qrup" in message.text or "1 ci qrup" in message.text:
                        print("type :", "BLOK 1")
                        type = "1-ci qrup"
                        codeType = "BLOK1"
                    elif "2-ci qrup" in message.text or "2 ci qrup" in message.text:
                        type = "2-ci qrup"
                        codeType = "BLOK2"

                        print("type :", "BLOK 2")
                    elif "3-cü qrup" in message.text or "3 cü qrup" in message.text:
                        print("type :", "BLOK 3")
                        type = "3-cü qrup"
                        codeType = "BLOK3"

                    elif "4-cü qrup" in message.text or "4 cü qrup" in message.text:
                        print("type :", "BLOK 4")
                        type = "4-cü qrup"
                        codeType = "BLOK4"

                elif "Buraxılış" in message.text:
                    print("type :", "Buraxilis")
                    type = "Buraxılış"
                    codeType = "BURAXILIS"

                # extracting the class
                if "11-ci sinif" in message.text or "11 ci sinif" in message.text:
                    print("grade :", "11")
                    grade = 11
                    codeGrade = "grade_11"
                elif "10-cu sinif" in message.text or "10 cu sinif" in message.text:
                    print("grade :", "10")
                    grade = 10
                    codeGrade = "grade_10"
                elif "9-cu sinif" in message.text or "9 cu sinif" in message.text:
                    print("grade :", "9")
                    grade = 9
                    codeGrade = "grade_9"
                # print(fileName)
                print("sender_id : ", message.sender_id)
                print("text :", message.text)
                print("date :", message.date)
                new_uuid = str(uuid.uuid4())

                path = await message.download_media( "./documents/"+new_uuid)
                fileSize = os.path.getsize(path)
                contentType="application/pdf"
                newFileName=new_uuid + "." + fileExtension
                
                pdf = PyPDF2.PdfReader(path)
                # Extract the middle page of the PDF document.
                # ÷page = pdf.getPage(pdf.getNumPages() // 2)
                page = len(pdf.pages) // 2
                images_from_path = convert_from_path(
                    path, fmt="jpeg", first_page=max(1, page), last_page=max(1, page)
                )
                print(images_from_path)
                # Apply OCR to the image to extract the text.
                text = pytesseract.image_to_string(images_from_path[0])
                # print("text", text)
                variant_regex = r"(?i)\bvari\s*([A-Z])|\b([A-Z])\s*vari`"

                match = re.search(variant_regex, text)
                if match:
                    variant = "Variant" +match.group(1) or match.group(2) or match.group(3)
                    codeVariant = match.group(1) or match.group(2) or match.group(3)
                    print("variant :", variant)
                else:
                    print("No variant found in the text")
                print("------------")

                data.append(
                    {
                        "text": message.text,
                        "variant": variant,
                        "code_variant": codeVariant,
                        "date": date,
                        "fileName": newFileName ,
                        "grade": grade,
                        "code_grade": codeGrade,
                        "type": type,
                        "code_type": codeType,
                        "contentType":contentType,
                        "fileSize":fileSize
                    }
                )
                i += 1

            # print("File saved to", path)  # printed after download is done
    print(i, " files to upload")

    # Convert the object array to a JSON string
    json_string = json.dumps(data)
    # Write the JSON string to a file
    with open(f"documents.json", "w") as f:
        f.write(json_string)


with client:
    client.loop.run_until_complete(main(phone))


# # Open the PDF file.
# with open("./documents/kainat9.pdf", "rb") as file:
#     # Load the PDF document.
#     pdf = PyPDF2.PdfReader(file)

#     # Extract the middle page of the PDF document.
#     # ÷page = pdf.getPage(pdf.getNumPages() // 2)
#     page = len(pdf.pages) // 2
#     images_from_path = convert_from_path(
#         "./documents/kainat9.pdf", fmt="jpeg", first_page=page
#     )
#     # Apply OCR to the image to extract the text.
#     text = pytesseract.image_to_string(images_from_path[2])


#     print(text)
