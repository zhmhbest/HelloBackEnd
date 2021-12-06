package org.example;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
public class HelloRestController {
    @GetMapping(value="/sayHello", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String sayHello(@RequestParam String name) {
        final HashMap<String, String> map = new HashMap<String, String>() {{
            put("name", name);
            put("say", "Hello");
        }};
        return map.toString();
    }
}
