<link rel="stylesheet" href="https://zhmhbest.gitee.io/hellomathematics/style/index.css">
<script src="https://zhmhbest.gitee.io/hellomathematics/style/index.js"></script>

# [SpringBoot](../index.html)

## Demo

登录[Spring Initializr](https://start.spring.io/)下载一个项目模板。

![Initializr](images/spring_initializr.png)

`HelloController.java`

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String getHello(HttpServletRequest request, HttpServletResponse response) {
        System.out.println(request.getHeader("User-Agent"));
        response.setHeader("MyHeader", "Get");
        return "Hello";
    }

    @PostMapping("/hello")
    public String postHello(HttpServletRequest request, HttpServletResponse response) {
        System.out.println(request.getHeader("User-Agent"));
        response.setHeader("MyHeader", "Post");
        return "Hello";
    }

}
```

```batch
mvn package
start http://127.0.0.1:8080/hello
@FOR /F "usebackq" %f in (`DIR /B "target\*.war"`) DO java -jar "target/%f"
```
