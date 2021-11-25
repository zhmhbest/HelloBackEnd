
**连接点**：可以被增强的方法。

**切入点**：实际被增强的方法。

**通知**：增强的逻辑部分，常见通知有：

- 前置通知：`@Before`
- 返回通知：`@After`
- 环绕通知：`@Around`
- 最终通知：`@AfterReturning`
- 异常通知：`@AfterThrowing`

**切面**：把通知应用到切入点的过程。

**实现方式**：

- 有接口使用`JDK`动态代理
- 没有接口使用`CGLIB`动态代理（在子类中增强父类方法）

### Proxy

`Speaker.java`

```java
public interface Speaker {
    void sayHello();
    void makeSpeech(String s);
    void sayBye();
}
```

`User.java`

```java
public class User implements Speaker {
    protected String name;
    public User(String name) { this.name = name; }
    @Override
    public void sayHello() { System.out.printf("%s: Hello\n", this.name); }
    @Override
    public void makeSpeech(String s) { System.out.printf("%s: %s\n", this.name, s); }
    @Override
    public void sayBye() { System.out.printf("%s: Bye\n", this.name); }
}
```

#### JDK

`Main.java`

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class Main {
    static <T> T proxyJDK(Object obj, Class<T> cls) {
        final ClassLoader L = Main.class.getClassLoader();
        final Object R = Proxy.newProxyInstance(L, new Class[]{cls}, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
                final String name = method.getName();
                System.out.printf("↓↓↓↓ Before %12s ↓↓↓↓\n", name);
                Object ret = method.invoke(obj, args); // 实际调用
                System.out.printf("↑↑↑↑ After  %12s ↑↑↑↑\n\n", name);
                return ret;
            }
        });
        return (T) R;
    }
    public static void main(String[] args) {
        Speaker speaker = proxyJDK(new User("Peter"), Speaker.class);
        speaker.sayHello();
        speaker.makeSpeech("发言内容");
        speaker.sayBye();
    }
}
```

#### CGLIB

`Main.java`

```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(User.class);
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object obj, Method method, Object[] params, MethodProxy proxy) throws Throwable {
                final String name = method.getName();
                System.out.printf("↓↓↓↓ Before %12s ↓↓↓↓\n", name);
                Object ret = proxy.invokeSuper(obj, params);
                System.out.printf("↑↑↑↑ After  %12s ↑↑↑↑\n\n", name);
                return ret;
            }
        });
        User user = (User) enhancer.create(new Class[]{String.class}, new Object[]{"Ann"});
        user.sayHello();
        user.makeSpeech("发言内容");
        user.sayBye();
    }
}
```
