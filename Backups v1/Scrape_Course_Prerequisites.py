"""
1. Scrapes the web using URL of every course number already collected
2. Notes course name, Recommended and Mandatory prerequisites in dictionary for each course number
3. Goes through all course prerequisites for each course and adds the course to the prerequisites list of "Recommended for" and "Mandatory for"

Author: Extrillo, 
Date: 15-07-2023
"""

import time 
import json
start_time = time.time()

from selenium import webdriver 
from selenium.webdriver import Chrome 
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.common.by import By 
import re
import os
from alive_progress import alive_bar

# start by defining the options 
options = webdriver.ChromeOptions() 
options.headless = True
options.page_load_strategy = 'none' 


chrome_path = os.getcwd() + "\\chromedriver.exe"
chrome_path = r"C:\Users\victo\Downloads\chromedriver_win32\chromedriver.exe"
chrome_service = Service(chrome_path) 


# pass the defined options and service objects to initialize the web driver 
driver = Chrome(executable_path = chrome_path, options=options)  #, service=chrome_service
driver.implicitly_wait(5)

file_courseNumbers = open('courseNumbers.txt','r')
courseNumbers = file_courseNumbers.read().split(',')
file_courseNumbers.close()

# Comment out if the script should not override the previous version every time
courseDic = {}
for courseNumber in courseNumbers:
    courseDic[courseNumber] = {}
    courseDic[courseNumber]['Recommended for'] = []
    courseDic[courseNumber]['Mandatory for'] = []
    courseDic[courseNumber]['Danish title'] = ""
    courseDic[courseNumber]['English title'] = ""

courses_nonexistant = []
n_courses_nonexistant = 0

errors = []
n_errors = 0

#courseNumbers = ['01005']
#courseNumber = '01005'
with alive_bar(len(courseNumbers)) as bar:
    for courseNumber in courseNumbers:
        url = "https://kurser.dtu.dk/course/" + courseNumber

        driver.get(url) 
        #time.sleep(10)

        try:
            header_content = driver.find_element(By.CSS_SELECTOR, "div[class*='col-xs-8']")
            courseDic[courseNumber]['Danish title'] = header_content.find_elements(By.CSS_SELECTOR,"h2")[0].text[6:]
        except:
            n_errors += 1
            errors.append(courseNumber + ": Header fetch error")
        try:
            content = driver.find_element(By.CSS_SELECTOR, "div[class*='box information'")
            table_contents = []
            table_rows = content.find_elements(By.TAG_NAME, "tr")
            recommendedPrerequisites = []
            mandatoryPrerequisites = []
            
            for row in table_rows:
                cells = row.find_elements(By.TAG_NAME,"td")
                row_content = [cell.text for cell in cells]
                table_contents.append(row_content)

                if (row_content[0].lower() == 'engelsk titel'):
                    courseDic[courseNumber]['English title'] = row_content[1]

                if ('forudsætninger' in row_content[0].lower()):
                    list_str_content = re.split(',|/| |\.|;|-|\(|\)', row_content[1])

                    for str_content in list_str_content:

                        if (len(str_content) == 5 and len(re.findall(r'\d+', str_content)) > 0):
                            if ('anbefalede forudsætninger' == row_content[0].lower() and str_content not in recommendedPrerequisites):
                                recommendedPrerequisites.append(str_content)
                            if ('obligatoriske forudsætninger' == row_content[0].lower() and str_content not in mandatoryPrerequisites):
                                mandatoryPrerequisites.append(str_content)
            
            courseDic[courseNumber] = {"Recommended prerequisites": recommendedPrerequisites,
                                       "Mandatory prerequisites": mandatoryPrerequisites}
            
        except:
            n_errors += 1
            errors.append(courseNumber + ": box information error")
            
        bar.title("errors: " + str(n_errors) + '\n')
        bar()
        
for courseNumber in courseNumbers:
    if (courseNumber not in errors):
        for course_to_modify in courseDic[courseNumber]['Recommended prerequisites']:
            try:
                courseDic[course_to_modify]['Recommended for'].append(courseNumber)
            except:
                if course_to_modify not in courses_nonexistant:
                    courses_nonexistant.append(course_to_modify)
                    n_courses_nonexistant += 1
                    
        for course_to_modify in courseDic[courseNumber]['Mandatory prerequisites']:
            try:
                courseDic[course_to_modify]['Mandatory for'].append(courseNumber)
            except:
                if course_to_modify not in courses_nonexistant:
                    courses_nonexistant.append(course_to_modify)
                    n_courses_nonexistant += 1
                    
print("Found " + str(n_errors) + " in following courses:")
print(errors)
    
json.dump(courseDic, open('courseDic.json','w'))







