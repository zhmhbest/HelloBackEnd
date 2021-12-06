package org.example;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {
    /**
     * 绑定内置JSP页面
     */
    @RequestMapping(path = "/viewHello")
    public String viewHello(Model model) {
        // 在接下来的页面中可以使用的引用
        model.addAttribute("hi", new String("This is 'hello' !"));
        // 重定向到 WEB-INF/pages/hello.jsp
        return "hello";
    }
}