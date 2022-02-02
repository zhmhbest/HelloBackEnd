package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1.创建路由
	router := gin.Default()

	// 2.静态文件目录
	router.Static("/static", "./static")

	// 3.绑定路由规则，执行的函数
	router.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/static/index.html")
	})

	// 3.1 路径参数
	router.GET("/parameter/path/:name/*action", func(c *gin.Context) {
		name := c.Param("name")
		action := c.Param("action")
		message := name + " is " + action
		c.String(http.StatusOK, message)
	})

	// 3.2 查询参数
	router.GET("/parameter/query", func(c *gin.Context) {
		firstname := c.DefaultQuery("firstname", "Guest")
		lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")
		c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
	})

	// 3.3 表单参数
	router.POST("/parameter/form", func(c *gin.Context) {
		message := c.PostForm("message")
		nick := c.DefaultPostForm("nick", "anonymous")
		c.JSON(200, gin.H{
			"message": message,
			"nick":    nick,
		})
	})

	// 4.监听端口
	router.Run(":8000")
}
