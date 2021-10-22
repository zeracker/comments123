package com.vito.comments.query.util;

/**
 * xml解析工厂类
 */
public class XmlParserFactory {

    public static XmlParser getParserByName(String className) throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        return (XmlParser) Class.forName("com.hsnn.bankPay.query.util.impl." + className ).newInstance();
    }
}
