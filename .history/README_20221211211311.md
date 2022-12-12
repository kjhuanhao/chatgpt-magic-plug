# OpenAi（Chatgpt）



## 优势

1. 有别于chatgpt，其实是直接调用了[openai](https://beta.openai.com/docs)的接口，详细可看openai文档
2. 只需替换你的key，就可以使用，或者使用本项目提供的key（支持多个key，随机使用）
3. 无需获取token，也无需任何梯子即可使用
4. 使用`text-davinci-003`模型
5. 后端可部署自己的服务器



## 后端实现

使用纯Python实现

### 必备模块

你可以使用`pip`安装它们

```python
flask
flask_cors
openai
flask_limiter
```

### 配置项

```python
configs = \
{
# 替换为你的api_key <https://beta.openai.com/account/api-keys>
"keys" : ["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",
          "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"
          ],
# 这个是设置回答的长度,最大可以设置到4096 (免费额度为$18,该值影响你的用量)
"max_tokens":1000,
#值越高意味着模型将承担更多风险。对于更具创造性的应用程序，请尝试 0.9,建议0.5-0.6
"temperature":0.5,
}
```



### 接口文档

#### 请求参数
| 参数                | 类型    | 说明                                                         |
| ------------------- | ------- | ------------------------------------------------------------ |
| key（无需）         | api_key | https://beta.openai.com/account/api-keys                     |
| prompt（必须）      | str     | 问题（必须）                                                 |
| max_tokens（可选）  | int     | 这个是设置回答的长度,最大可以设置到4096 (免费额度为$18,该值影响你的用量)<br />默认：1000 |
| temperature（可选） | float   | 值越高意味着模型将承担更多风险。建议0.5-0.6，最大可以为0.9<br />默认：0.5 |


#### 请求示例
```json
{
  "prompt":"写一个关于数学建模的论文"
}

```
#### 请求示例
##### 成功示例
```json
{
"code": 200,
"msg": "\n\n摘要\n\n本文旨在探讨数学建模在解决实际问题中的应用。首先，我们简要介绍了数学建模的定义和特点，以及它在工程和科学中的重要性。其次，我们给出了一个具体的数学建模案例，该案例涉及货运"
}
```
##### 失败示例

>  条件：未知错误

```json
{
"code": 400,
"error": "your_error",
"msg":"出现意外的错误，请检查你的配置"
}
```

