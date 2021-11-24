<link rel="stylesheet" href="https://zhmhbest.gitee.io/hellomathematics/style/index.css">
<script src="https://zhmhbest.gitee.io/hellomathematics/style/index.js"></script>

# [Django](../index.html)

[TOC]

## 相关概念

### MVT

- M: 模型，对应MVC的M，用于与数据库交互。
- V: 视图，对应MVC的C，用于接受请求和响应数据。
- T: 模板，对应MVC的V，用于决定最终显示样式。

## 创建及运行

### 创建项目

```bash
# 安装Django
pip install Django

# 创建项目
django-admin startproject <项目名>
```

### 创建应用

```bash
# 创建应用
python manage.py startapp <应用名>
```

### 项目结构

```txt
Projects
│  db.sqlite3                       数据库文件
│  manage.py                        管理Django站点
│
├─Project                           <项目名>
│      asgi.py
│      settings.py                  项目配置文件
│      urls.py                      URL路由配置
│      wsgi.py                      WSGI应用配置
│      __init__.py
│
├─main                              <应用名>
│  │  admin.py                      网站后台管理
│  │  apps.py
│  │  models.py                     数据库设计
│  │  views.py                      接受请求、返回应答
│  │  tests.py                      测试代码
│  │  __init__.py
│  │
│  └─migrations                     迁移文件目录
│          __init__.py
│
└─templates
```

### 启动服务

```bash
# 启动服务
python manage.py runserver [ip:port]
```

## 项目配置

### 注册应用

`<project>/setting.py`

```python
# 注册应用
INSTALLED_APPS = [
    'main.apps.MainConfig',
]

# 数据库配置
DATABASES = {
    'default': {
        # 【sqlite】
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),

        # 【mysql】
        # pip install pymysql
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '${数据库名}',
        'USER': '${数据库登录用户名}',
        'PASSWORD': '${数据库登录密码}',
        'HOST': 'localhost',
        'PORT': 3306,
    }
}

# 设置模板文件目录
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 语言本地化
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
```

### 路由配置

`<project>/urls.py`

```python
from django.contrib import admin
from django.urls import path

import main.views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('1/', main.views.first),
    path('2/', main.views.second),
    path('3/', main.views.third),
]
```

## 可视化后台管理

### 创建超级管理员

```bash
python manage.py createsuperuser
#   ...\python.exe manage.py c  reatesuperuser
#   用户名:
#   电子邮件地址:
#   Password:
#   Password (again):
#   Superuser created successfully.
```

`http://127.0.0.1:8000/admin/`

## Module

### mysql支持

`<app>/__init__.py`

```python
import pymysql
pymysql.install_as_MySQLdb()
```

### 设计数据库模型

`<app>/models.py`

```python
# coding=utf-8
from django.db import models


# 模型设计代码
class Student(models.Model):
    # id: 自动添加，不需要手动设计
    name = models.CharField(max_length=20)
    number = models.IntegerField()
    birthday = models.DateField()
    is_del = models.BooleanField()
    """
        自增: models.AutoField()
        字符串: models.CharField(max_length=?)
        大文本: models.TextField()
        整形: models.IntegerField()
        完全浮点数: models.DecimalField(max_digits=None, decimal_places=None)
        计算浮点数: models.FloatField()
        日期: models.DateField(auto_now=False, auto_now_add=False)
        时间: models.TimeField(auto_now=False, auto_now_add=False)
        日期+时间: models.DateTimeField(auto_now=False, auto_now_add=False)
        文件: models.FileField()
        图片: models.ImageField()
    """
    """
        primary_key:    主键
        unique:         不可重复
        db_index:       加索引
        db_column:      自定义列名
        null:           允许为null
        blank:          后台管理添加时，是否可以不填写
    """


class Computer(models.Model):
    """
    定义外键
        CASCADE:    删除关联数据，与之关联的数据也删除
        DO_NOTHING: 删除关联数据，什么也不做
        SET_NULL:   删除关联数据，与之关联的值设置为null
        PROTECT:    删除关联数据，引发错误ProtectedError
        SET:        删除关联数据，与之关联的值设置为指定的值
    """
    holder = models.ForeignKey('Student', on_delete=models.SET_NULL, blank=True, null=True)
```

### 迁移文件

#### 生成迁移文件

```bash
python manage.py makemigrations
#   Migrations for 'main':
#   main\migrations\0001_initial.py
#       - Create model Table
```

#### 执行迁移文件

```bash
python manage.py migrate
#   Operations to perform:
#       Apply all migrations: admin, auth, contenttypes, main, sessions
#   Running migrations:
#       Applying ...
#       Applying ...
#       ...
```

### 注册模型到后台管理界面

`<app>/admin.py`

```python
from django.contrib import admin

# Register your models here.
from main.models import Student
from main.models import Computer

admin.site.register(Student)
admin.site.register(Computer)
```

## View

`<app>/views.py`

```python
# 模板使用
from django.shortcuts import render

# 基础响应、请求
from django.http import HttpRequest, HttpResponse
from django.core.handlers.wsgi import WSGIRequest
from django.contrib.sessions.backends.db import SessionStore
import json


def get_current_time_string():
    import time
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))


# Create your views here.
def first(request):
    """
    请求与响应
    """
    def get_request_message(_request):
        _message = {
            'http': {
                'HTTPS': _request.is_secure(),
                'AJAX': _request.is_ajax(),
                'METHOD': _request.method,
                'URI': _request.get_raw_uri(),
                'HOST':  _request.get_host(),
                'PORT':  _request.get_port(),
                'PATH': _request.path,
                'ENCODING': _request.encoding,
                'CONTENT_LENGTH': _request.META['CONTENT_LENGTH'],
                'CONTENT_TYPE': _request.META['CONTENT_TYPE'],
                'REMOTE_ADDR': _request.META['REMOTE_ADDR'],
            },
            'headers': _request.headers._store,     # _store is dict()
            'cookies': _request.COOKIES,            # COOKIES is dict()
            # from django.contrib.sessions.backends.db import SessionStore
            'session': _request.session._session,
            #  _request.GET, _request.POST is dict()
            'parameter': _request.GET if 'GET' == _request.method else _request.POST,
            'files': _request.FILES,                # FILES is dict()
        }
        return _message
    # end def
    print(type(request))
    request_message = get_request_message(request)

    # Session
    # request.session.clear()
    login_time = request.session.get('first_login_time', 'first')
    if login_time == 'first':
        request.session['first_login_time'] = get_current_time_string()
    request_message['first_login_time'] = login_time

    # Response
    response = HttpResponse()
    response.charset = 'utf-8'
    response.status_code = 200
    response['Content-Type'] = 'text/json'

    # Cookie
    # 注意set_cookie的其它参数
    response.set_cookie('last', get_current_time_string())

    response.write(json.dumps(request_message))
    return response


def second(request):
    """
    模板使用
    """
    return render(request, '../templates/main/index.html', {
        'title': '标题',
        'headline': '模板使用Demo',
        'range1': list(range(10)),
        'dict1': {'a': 'Apple', 'b': 'Banana', 2: '200'}
    })


def third(request):
    import random
    from main.models import Student

    # 添加数据
    stu = Student()
    stu.name = "名字"
    stu.number = random.randint(1000, 9999)
    stu.birthday = '1998-8-23'
    stu.is_del = False
    stu.save()

    # 查询数据
    print(Student.objects.all())
    stu = Student.objects.get(id=1)
    print(stu)
    # stu = Student.objects.filter(id=1)
    # print(stu)
    # stu = Student.objects.exclude(id=1)
    # print(stu)
    # print(Student.computer_set.all())

    # 修改数据
    stu.name = "修改"
    stu.save()

    # 删除数据
    # stu.delete()
    return HttpResponse("Success!")
```


