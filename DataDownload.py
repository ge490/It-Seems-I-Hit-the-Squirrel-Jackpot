# Use this file to download data from Squirrel Stories on NYC Open Data


# First three lines are from https://dev.socrata.com/foundry/data.cityofnewyork.us/gfqj-f768

from sodapy import Socrata

client = Socrata("data.cityofnewyork.us", "TkRdzZxXZww7Khfwq84rH02To", username="gelbert@pratt.edu", password="nyc&Cats27")

results = client.get("gfqj-f768", limit=810)

return results

# class Story:
    # def __init__(self, hect, shift, date, notes, types):
        # self.hectare = hect
        # self.shift = shift
        # self.date = date
        # self.notes = notes
        # self.topics = types

    # def __str__(self):
        # return("Hectare: " + str(self.hectare) + "\nShift: " + str(self.shift)
              # + "\nDate: " + str(self.date) + "\nNotes: " + str(self.notes) +
              # "\nTopics:" + str(self.topics))

# storiesList = []

# for observation in results:
    # topics = []

    # for key, value in observation.items():
        # if key.startswith("story_topic"):
            # topics.append(key + ": " + str(value))

    # new_story = Story(observation["hectare"], observation["shift"], observation["date"], observation["note_squirrel_park_stories"], topics)
    # storiesList.append(new_story)
