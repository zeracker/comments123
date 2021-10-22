package com.vito.comments.query.util;

import com.vito.comments.entity.base.ParamObject;

/**
 * 解析xml占位符回调
 */
public interface XmlParser {
    String parse(String param);

    String parse(ParamObject param);

    String parse();
}
