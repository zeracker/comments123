package com.vito.comments.query.util.impl;

import com.vito.comments.entity.base.ParamObject;
import com.vito.comments.query.util.XmlParser;

public class OrgParser implements XmlParser {
    @Override
    public String parse(String param) {
        return null;
    }

    @Override
    public String parse(ParamObject param) {
//        return param.getUser().getOrgId();
        return "";
    }

    public String parse() {
        return "haha";
    }
}
