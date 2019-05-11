
# -*- coding:utf-8 -*-
#!/usr/bin/env python

import requests
from pymongo import MongoClient
import time
from fake_useragent import UserAgent

client = MongoClient()
db=client.test
lagou = db.lagou

headers = {
    'Referer': 'https://www.lagou.com/jobs/list_python?city=%E6%B7%B1%E5%9C%B3&cl=false&fromSearch=true&labelWords=&suginput=',
}


def get_job_info(page, kd):
    for i in range(page):
        url = 'https://www.lagou.com/jobs/positionAjax.json?city=%E5%8C%97%E4%BA%AC&needAddtionalResult=false&isSchoolJob=0'
        payload = {
            'first':'false',
            'pn':str(i),
            'kd': kd,
        }

        ua = UserAgent()
        headers['User-Agent'] = ua.random
        response = requests.post(url, data=payload, headers=headers)

        if response.status_code == 200:
            job_json = response.json()['content']['positionResult']['result']
            lagou.insert(job_json)
            #print(job_json)

        else:
            print('Something Wrong!' )

        print('正在爬取第 ' + str(i) + ' 页的数据...')
        time.sleep(1)

if __name__ == '__main__':
    get_job_info(31, 'Python')
