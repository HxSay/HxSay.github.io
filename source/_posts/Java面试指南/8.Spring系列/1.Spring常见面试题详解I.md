---
title: 1.Spring常见面试题详解I
date: 2024-03-15 10:02:06
tags:
---

## Spring Bean的作用域

目前Spring Bean的作用域或者说范围主要有五种，如下所示：

| 作用域 | 描述  | 适用环境 |
|---|---|---|
| singleton    | 在Spring IoC容器中仅存在一个Bean实例，以单例方式存在。默认作用域。                                               | 任何Spring应用程序环境                           |
| prototype    | 每次从容器中调用Bean时，都返回一个新的实例，即每次调用`getBean()`时，相当于执行`new XxxBean()`。               | 任何Spring应用程序环境                           |
| request      | 每次HTTP请求都会创建一个新的Bean。适用于web的Spring `WebApplicationContext`环境。                               | Spring Web应用程序环境                           |
| session      | 同一个HTTP Session共享一个Bean，不同Session使用不同的Bean。适用于web的Spring `WebApplicationContext`环境。      | Spring Web应用程序环境                           |
| application  | 限定一个Bean的作用域为ServletContext的生命周期。适用于web的Spring `WebApplicationContext`环境。                 | Spring Web应用程序环境                           |

## Spring循环依赖如何解决？

## Spring容器的初始化流程？

Spring 容器的启动过程实际上就是 AbstractApplicationContext 抽象类中 refresh 方法的执行过程，不考虑异常情况，一个容器正常启动的过程大致可以分为以下五个阶段：

##### 1、初始化上下文：

对应 prepareRefresh方法，用于完成重置上下文标志位，初始化配置文件，重置早期事件缓存等工作。

##### 2、初始化 BeanFactory：

- 创建实例：即为当前重新创建一个 BeanFactory；

- 完成准备工作：为新 BeanFactory 实例设置一些默认配置，并添加一些必要的后处理器；

- 后处理：向工厂注册一些诸如 Scope 、表达式解析器、类型转换器等必要的基本组件；

- 使用后处理器：调用 BeanFactoryPostProcessor 对工厂进行后处理器，在这个阶段将会向 BeanFactory 注册必要的 BeanDefinition，我们的配置类就在这个阶段生效；

- 注册 BeanPostProcessor：从 BeanFactory 中创建并获取所有的 BeanPostProcessor，然后将其注册到工厂中。

##### 3、初始化其他组件：

- 初始化消息源：尝试从容器中获取一个 MessageSource，如果没有就建一个新的；

- 初始化广播器：尝试从容器中获取一个 ApplicationEventMulticaster，如果没有就建一个新的；

- 注册消息监听器：将容器中所有实现了 ApplicationListener 接口的 Bean 都注册到广播器；

- 预加载所有单例 Bean：加载容器中所有非懒加载的单例 Bean ，并触发 SmartInitializingSingleton 回调接口。

##### 完成刷新：

清空上下文资源缓存；

触发 Lifecycle 回调：从容器中获取所有实现了 Lifecycle 接口的 Bean，然后调用回调方法；

发布 ContextRefreshedEvent 事件；

启动内置的 Web 容器（SpringBoot 应用）。

## Spring bean的生命周期？

![img.png](img.png)

1、实例化（Instantiation）：实例化一个 Bean 对象，Spring工厂（容器）会从.xml文件、Java文件中读取Bean的定义，并使用反射创建一个JavaBean对象的实例。

2、属性赋值（Populate）：为 Bean 设置相关属性和依赖，这个阶段主要是将 **配置文件或者注解中定义的属性值** 设置到Bean的对应属性上。这些属性可以通过构造函数注入、属性注入或者其他方式进行赋值。

3、初始化（Initialization）：在这个阶段，可以执行一些定制化的初始化工作，例如 **资源的加载** 、**依赖关系的注入** 、**建立连接等** 。 这个阶段可以通过实现InitializingBean接口的afterPropertiesSet()方法或者通过在Bean的定义中配置的初始化方法来实现。

4、销毁（Destructuion）：销毁阶段发生在Bean不再需要时，也就是在Spring容器关闭之前。在这个阶段，Spring容器会调用特定的回调方法来执行Bean的清理工作，释放资源等。这些回调方法可以是实现了特定接口的方法，例如DisposableBean接口的destroy()方法，或者是通过在Bean的定义中配置的销毁方法。在这个阶段，可以进行一些清理工作，例如关闭数据库连接、释放文件句柄等。完成销毁后，Bean的生命周期就结束了。

## Spring常见注解？

## Spring IOC、AOP

### Spring中IOC是什么？AOP是什么？有什么好处？

IOC:Invert Of Control(控制反转),所谓控制反转是指将Java中的对象管理、资源管理等统一交给Spring容器来完成，比如可以通过@Autowired、@Resource等方式来注入对象而无需通过new的方式来新建对象。这样能够更加有效的利用资源，防止程序员四处new对象、不释放系统资源等操作导致的程序异常、错误等。

AOP：Aspect-Oriented Programming（面向切面编程），能够将那些业务无关的公共逻辑都封装起来（事务处理、日志管理、权限控制等），便于减少系统的重复代码量，降低模块儿间的耦合性，利于未来的扩展和维护。

Spring的AOP是基于动态代理实现的，如果被代理对象实现了某个接口则Spring AOP会使用JDK Proxy去创建对象；如果被代理对象没有实现接口的对象，Spring AOP会使用Cglib生成一个被代理对象的子类来作为代理。下面是一些AOP的专业术语：

| 术语         | 含义                                                              |
|--------------|-------------------------------------------------------------------|
| 目标(Target) | 被通知的对象                                                       |
| 代理(Proxy)  | 向目标对象应用通知之后创建的代理对象                               |
| 连接点(JoinPoint) | 目标对象的所属类中，定义的所有方法均为连接点                     |
| 切入点(Pointcut) | 被切面拦截 / 增强的连接点（切入点一定是连接点，连接点不一定是切入点） |
| 通知(Advice) | 增强的逻辑 / 代码，也即拦截到目标对象的连接点之后要做的事情       |
| 切面(Aspect) | 切入点(Pointcut) + 通知(Advice)                                    |
| Weaving(织入) | 将通知应用到目标对象，进而生成代理对象的过程动作                     |

### Spring AOP实现的底层原理？

Spring AOP（面向切面编程）**底层实现原理就是在运行时动态生成代理对象，通过代理链实现对目标对象的方法拦截。** 其主要实现方式包括JDK动态代理和CGLIB动态代理。

1. **JDK动态代理**： 首先，判断目标类是否实现InvocationHandler接口或是Proxy类。若实现，则使用JDK动态代理，利用反射来接收被代理的类。JDK动态代理是基于接口的代理，需要目标类实现接口，通过Proxy.newProxyInstance()方法动态创建代理对象。

2. **CGLIB动态代理**：如果目标类没有实现InvocationHandler接口或是Proxy类，则使用CGLIB进行AOP动态代理。CGLIB是通过继承的方式实现动态代理，通过生成目标类的子类来实现代理功能。CGLIB基于ASM开发，通过生成目标类的子类来织入切面逻辑。

Spring AOP的应用场景包括但不限于日志记录、权限验证、事务管理等业务场景。它在初始化时已将目标对象进行代理，并放入Spring容器中。运行期间进行织入，生成字节码，并加载到虚拟机中。

### Spring AOP 和 AspectJ AOP 有什么区别？

1、Spring AOP属于实时增强，AspectJ是编译实时增强。
2、Spring AOP基于代理模式，AspectJ基于字节码操作。
3、Spring AOP实际上已经集成了AspectJ，AspectJ相较于Spring AOP来说功能更加强大，但是也更加复杂。
4、切面使用较少2者的性能差异不大，切面使用较多的情况下最好选择AspectJ，比Spring AOP快很多。

### AspectJ定义的通知类型有那些？

- Before（前置通知）：目标对象的方法调用之前触发
- After （后置通知）：目标对象的方法调用之后触发
- AfterReturning（返回通知）：目标对象的方法调用完成，在返回结果值之后触发AfterThrowing（异常通知）：目标对象的方法运行中抛出 / 触发异常后触发。
- AfterReturning 和 AfterThrowing 两者互斥。如果方法调用成功无异常，则会有返回值；如果方法抛出了异常，则不会有返回值。
- Around （环绕通知）：编程式控制目标对象的方法调用。环绕通知是所有通知类型中可操作范围最大的一种，因为它可以直接拿到目标对象，以及要执行的方法，所以环绕通知可以任意的在目标对象的方法调用前后搞事，甚至不调用目标对象的方法

### 多个切面的执行顺序如何控制？

1、使用@Order注解直接定义切面顺序

```aidl
// 值越小优先级越高
@Order(3)
@Component
@Aspect
public class LoggingAspect implements Ordered {
```

2、实现Ordered接口重写getOrder方法

```aidl
@Component
@Aspect
public class LoggingAspect implements Ordered {

    // ....

    @Override
    public int getOrder() {
        // 返回值越小优先级越高
        return 1;
    }
}
```

## Spring事务相关

### 1.Spring事务的传播行为和隔离级别？

隔离性是ACID属性中的一个：

- 原子性（Atomicity）
- 一致性（Consistency）
- 隔离性（Isolation）
- 持久性（Durability）

事务隔离性问题包括以下三种：

- **脏读（Dirty Read）**：指一个事务读取了另一个事务未提交的数据。事务A读取了事务B修改的数据，事务B这时候回滚了。
- **不可重复读（Non-repeatable Read）**：指在同一事务内，多次读取同一数据却得到不同结果。事务A读取数据，事务B修改数据，事务A再读取数据。
- **幻读（Phantom Read）**：指在同一事务内，多次执行同一查询，但返回不同的数据行，通常是由于并发事务插入或删除造成的。事务A读取了n行，事务B删除了一行，事务A再读数据不对。

隔离性表示的是数据在并发事务间的可见性，隔离级别越高，能解决的并发问题越多，但性能也可能受到影响，如下：

| 事务隔离级别        | Spring注解设置                          | 可解决的并发问题               |
|------------------|--------------------------------------|----------------------------|
| 默认（DEFAULT）    | @Transactional(isolation = Isolation.DEFAULT) | 不可用                      |
| 读取未提交（READ_UNCOMMITTED） | @Transactional(isolation = Isolation.READ_UNCOMMITTED) | 脏读                        |
| 读取已提交（READ_COMMITTED）   | @Transactional(isolation = Isolation.READ_COMMITTED) | 脏读、不可重复读                |
| 可重复读（REPEATABLE_READ）    | @Transactional(isolation = Isolation.REPEATABLE_READ) | 脏读、不可重复读、幻读             |
| 序列化（SERIALIZABLE）        | @Transactional(isolation = Isolation.SERIALIZABLE) | 脏读、不可重复读、幻读、串行化(防止任何并发问题) |

## 2.Spring事务失效的场景

**1. @Transactional 应用在非 public 修饰的方法上** 

@Transactional 注解的事务机制是通过 Spring AOP 实现的，而 Spring AOP 基于动态代理。对于动态代理而言，如果一个类中的方法不是 public，默认情况下无法被包外的代码直接访问。

如果一个类中有被 @Transactional 注解修饰的方法，而这些方法是非 public 的，Spring AOP 生成的代理对象无法直接调用这些方法，从而导致 @Transactional 注解在非 public 方法上不会生效，同时导致了事务失效。

**2. 代码中使用了try/catch处理了异常** 

@Transactional的实现方法是当发生异常的时候才会自动触发回滚，如果使用try/catch将异常捕获了，那么事务可能就无法回滚，导致事务失效。

**3. 调用方法内部使用了@Transational注解** 

当调用类内部的被 @Transactional 修饰的方法时，事务可能不会生效。这是因为 @Transactional 是基于 Spring AOP 实现的，而 Spring AOP 又是基于动态代理实现的。

当调用类内部的方法时，Spring AOP 生成的代理对象可能不会被触发，因为这个调用是通过 this 对象而不是代理对象完成的。这就绕过了代理对象，导致事务失效。

为确保 @Transactional 在类内部调用的方法上生效，一种常见的解决方案是将 @Transactional 注解放在另一个专门的 Service 类中，然后在该 Service 类内部调用需要事务支持的方法。这样确保了方法的调用会经过代理对象，从而使事务生效。

**4.timeout超时时间设置过小**
**5.数据库不支持事务**
**6.@Transactional 注解属性 propagation 设置错误**

**7.@Transactional 注解属性 rollbackFor 设置错误**
在 @Transactional 注解中，属性 rollbackFor 用于指定能够触发事务回滚的异常类型，如果设置错误，可能导致事务不会按预期进行回滚。

例如，rollbackFor 属性被设置为 MyException.class，但实际上在方法中抛出的是 RuntimeException。因此，尽管发生了异常，但由于异常类型不匹配，事务可能不会按照预期进行回滚。

### 4. Spring中的事务传播类型有哪些？

Spring 中的 @Transactional 注解用于管理事务，其中有一项属性是事务的传播类型（Propagation Type）。事务的传播类型定义了当一个方法被调用时，如果该方法已经在一个事务中运行，当前的方法应该如何参与到现有的事务中。

| 传播类型         | 描述     |
|-----|-----|
| REQUIRED        | 如果当前存在事务，则加入该事务；如果不存在事务，则创建一个新的事务。   |
| SUPPORTS        | 如果当前存在事务，则加入该事务；如果不存在事务，则以非事务方式执行。    |
| MANDATORY       | 如果当前存在事务，则加入该事务；如果不存在事务，则抛出异常。   |
| REQUIRES_NEW    | 无论当前是否存在事务，都会创建一个新的事务，并在该方法执行期间将当前事务挂起|
| NOT_SUPPORTED   | 以非事务方式执行方法，如果当前存在事务，则将其挂起。 |
| NEVER           | 以非事务方式执行方法，如果当前存在事务，则抛出异常。 |
| NESTED          | 如果当前存在事务，则在嵌套事务中执行；如果不存在事务，则创建一个新的事务。嵌套事务与父事务共享提交或回滚。 |
