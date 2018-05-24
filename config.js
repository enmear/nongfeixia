/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://198521632.nongfeixia.xyz';  //生产环境地址
// var host = 'https://myqpsvgc.qcloud.la';  //开发环境地址

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        //订单发布接口
        orderPublishUrl: `${host}/weapp/orderPublish`,
        //订单查询接口
        orderQueryUrl: `${host}/weapp/orderQuery`,
        //飞手订单查询接口
        flyerOrderQueryUrl: `${host}/weapp/flyerOrderQuery`,
        // 测试接口
        testUrl: `${host}/weapp/test`,
        //认证审核接口
        authUrl: `${host}/weapp/auth`,
        //修改用户信息接口
        modifyUserInfoUrl: `${host}/weapp/modifyUserInfo`,
        //订单支付
        payOrderUrl: `${host}/weapp/payOrder`,
        //钱包记录查询
        queryWalletRecordUrl: `${host}/weapp/queryWalletRecord`,
        //订单完成
        orderDoneUrl: `${host}/weapp/orderDone`,
        //接单
        receptOrderUrl: `${host}/weapp/receptOrder`,
        //发起支付
        doPaymentUrl: `${host}/weapp/doPayment`,
        //发布推文
        publishArticleUrl: `${host}/weapp/publishArticle`
    }
};

module.exports = config;
