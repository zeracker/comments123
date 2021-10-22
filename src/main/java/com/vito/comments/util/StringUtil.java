package com.vito.comments.util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil {
   private static ScriptEngineManager manager = new ScriptEngineManager();

    /**
     * 切割字符串为数组
     * @return
     */
    public static String[] splitUniq(String str , String regx) {
        if(AssertUtil.isNull(str)) {
            List<String> arrlist = new ArrayList<String>();
            String[] split = str.split(regx);
            for (String string2 : split) {
                if(arrlist.contains(string2)) {
                    continue;
                }
                arrlist.add(string2);
            }
            return arrlist.toArray(new String[arrlist.size()]);
        }
        return new String[] {};
    }


    /**
     * 切割字符串为数组
     * @return
     */
    public static String[] split(String str , String regx) {
        if(AssertUtil.isNull(str)) {
            List<String> arrlist = new ArrayList<String>();
            String[] split = str.split(regx);
            for (String string2 : split) {
                arrlist.add(string2);
            }
            return arrlist.toArray(new String[arrlist.size()]);
        }
        return new String[] {};
    }

    /**
     * 手机号验证
     *
     * @param str
     * @return 验证通过返回true
     */
    public static boolean isMobile(String str) {
        Pattern p = null;
        Matcher m = null;
        boolean b = false;
        p = Pattern.compile("^[1][3,4,5,6,7,8,9][0-9]{9}$"); // 验证手机号
        m = p.matcher(str);
        b = m.matches();
        return b;
    }
    /**
     * 判断字符串不为空
     *
     * @param str
     * @return
     */
    public static boolean isNotEmpty(String str) {
        boolean isNotEmpty = false;
        if (str != null && !str.trim().equals("") && !str.trim().equalsIgnoreCase("NULL")) {
            isNotEmpty = true;
        }
        return isNotEmpty;
    }

    public static boolean isEmpty(String str) {
        return !isNotEmpty(str);
    }
    /**
     * 判断字符串是否是整数
     *
     * @param number
     * @return
     */
    public static boolean isInteger(String number) {
        boolean isNumber = false;
        if (StringUtil.isNotEmpty(number)) {
            isNumber = number.matches("^([1-9]\\d*)|(0)$");
        }
        return isNumber;
    }

    /**
     * 判断字符串是否是金额
     * @param number
     * @return
     */
    public static boolean isMoney(String number) {
        boolean isNumber = false;
        if (StringUtil.isNotEmpty(number)) {
            isNumber = number.matches("^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,4})?$");
        }
        return isNumber;
    }
    //判断是否包含汉子
    public static boolean isMan(String pass) {
        boolean is  = false;
        String regHz = "[^\u4e00-\u9fa5]+";
        if(pass.matches(regHz)){
            is  = true;
        }
        return is;
    }

    //输入的密码不能是纯数字、纯字母或者纯特殊字符"
    public static boolean isContain(String pass) {
        boolean is  = false;
        String regStr = "(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,20}";
        if(pass.matches(regStr)){
            is  = true;
        }
        return is ;
    }
    //输入的密码不能是纯数字、纯字母或者纯特殊字符"
    public static boolean isContainPass(String pass) {
        boolean is  = false;
        String regStr = "^(?![0-9]+$)(?![^0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z]+$)(?![a-zA-Z0-9]+$)[a-zA-Z0-9\\S]+$";
        if(pass.matches(regStr)){
            is  = true;
        }
        return is ;
    }

    /**
     * 正则表达式验证if内的表达式  返回相应内容
     * @return
     */
    public static String valiIf(String ifcontent){

        Pattern p = Pattern.compile("if\\(.*?\\)\\{.*?\\}");
        Matcher m = p.matcher(ifcontent);
        String returnStr = "";
        while (m.find()){
            String str = m.group();
            String match = str.substring(str.indexOf("(") + 1 , str.indexOf(")"));//执行if()内的内容

                ScriptEngine se = manager.getEngineByName("js");
                try {
                    if( (Boolean)se.eval(match) ){
                        String content = str.substring(str.lastIndexOf("{") + 1 , str.lastIndexOf("}"));
                        returnStr = ifcontent.replace(str , content);
                        ifcontent = returnStr;
                    }else{
                        returnStr = ifcontent.replace(str , "");
                        ifcontent = returnStr;
                    }
                } catch (ScriptException e) {
                    e.printStackTrace();
                }
        }
        return returnStr.equals("") ? ifcontent : returnStr;
    }

    public static void main(String[] args) {
        String template = "${userName} 在${now} if(''=='3'){审核}  if(''=='1'){提交}  了上市持有者委托生产申报#{cyid} ";
        if(template != null){

            if(template.contains("${userName}")){
                template = template.replace("${userName}" , "333333" );
            }
            if(template.contains("${name}")){
                template = template.replace("${name}" , "333" );
            }
            if(template.contains("${now}")){
                template = template.replace("${now}" , MyTimeUtil.getCurrentTime() );
            }
            Pattern p = Pattern.compile("\\#\\{\\w+\\}");
            //处理java调用的部分
            Matcher m = p.matcher(template);
            while (m.find()){
                String str = m.group();
                String match = str.substring(str.indexOf("{") + 1 , str.indexOf("}"));
                template= template.replace("#{"+ match +"}" , "333333");
            }
            //处理if语句的部分
            template =  StringUtil.valiIf(template);
            System.out.println(template);
        }

    }
    /**
     * 获取汉字串拼音首字母，英文字符不变
     *
     * @param chinese 汉字串
     * @return 汉语拼音首字母
     */
    public static String cn2FirstSpell(String chinese) {
        StringBuffer pybf = new StringBuffer();
        char[] arr = chinese.toCharArray();
        HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();
        defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > 128) {
                try {
                    String[] _t = PinyinHelper.toHanyuPinyinStringArray(arr[i], defaultFormat);
                    if (_t != null) {
                        pybf.append(_t[0].charAt(0));
                    }
                } catch (BadHanyuPinyinOutputFormatCombination e) {
                    e.printStackTrace();
                }
            } else {
                pybf.append(arr[i]);
            }
        }
        return pybf.toString().replaceAll("\\W", "").trim().toUpperCase();
    }


}

