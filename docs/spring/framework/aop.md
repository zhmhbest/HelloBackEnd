
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

`UserInterface.java`

```java
public interface UserInterface {
    void hi();
    void sayHello(String name);
    void sayGoodbye(String name);
}
```

`User.java`

```java
public class User implements UserInterface {
    public void hi() { System.out.print("Hi!\n"); }
    public void sayHello(String name) { System.out.printf("%s: Hello\n", name); }
    public void sayGoodbye(String name) { System.out.printf("%s: Goodbye\n", name); }
}
```

#### JDK

`ProxyJDK.java`

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class ProxyJDK {
    public static void main(String[] args) {
        // 增强User
        User obj = new User();

        UserInterface user = (UserInterface) Proxy.newProxyInstance(
                ProxyJDK.class.getClassLoader(),
                new Class[]{UserInterface.class},
                new InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        String name = method.getName();
                        Object ret = null;
                        System.out.printf("====Before : %s\n", name);
                        ret = method.invoke(obj, args);
                        System.out.printf("====After  : %s\n", name);
                        return ret;
                    }
                }
        );

        user.sayHello("Java");
        user.sayGoodbye("Python");
    }
}
```

#### CGLIB

`ProxyCGLIB.java`

```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import java.lang.reflect.Method;

public class ProxyCGLIB {
    static class UserInterceptor implements MethodInterceptor {
        @Override
        public Object intercept(
                Object obj, Method method, Object[] params, MethodProxy proxy
        ) throws Throwable {
            String name = method.getName();
            System.out.printf("====Before : %s\n", name);
            Object result = proxy.invokeSuper(obj, params);
            System.out.printf("====After  : %s\n", name);
            return result;
        }
    }

    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(User.class);
        enhancer.setCallback(new UserInterceptor());
        User user = (User) enhancer.create();
        System.out.println(user);
        user.sayHello("Java");
        user.sayGoodbye("Python");
    }
}
```
