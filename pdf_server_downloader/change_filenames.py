import os
import uuid
import json

# Open the JSON file and load the data
with open('documents.json', 'r') as f:
    data = json.load(f)

# Iterate through each object in the JSON array
for obj in data:
    # Get the current filename and remove any non-ASCII characters
    old_filename = obj['fileName']
    
    # Generate a new UUID and rename the file in the directory
    new_uuid = str(uuid.uuid4())
    new_filepath = f'./documents/{new_uuid}.pdf'
    os.rename(f'./documents/{old_filename}', new_filepath)

    # Update the filename in the JSON object
    obj['fileName'] = f'{new_uuid}.pdf'

# Save the updated JSON data to the file
with open('documents.json', 'w') as f:
    json.dump(data, f)
