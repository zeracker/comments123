package com.vito.comments.util;

/**
 * @description: 邮箱验证码生成工具类
 * @create: 2020/11/19 16:29
 */
public class CodeUtil {
    //生成唯一的激活码
    public static String generateUniqueCode(){
        String flag = "";
        for (int i = 0; i <= 200; i++)
        {
            int intFlag = (int)(Math.random() * 1000000);

            flag = String.valueOf(intFlag);
            if (flag.length() == 6 && flag.substring(0, 1).equals("9"))
            {
                return(flag);
            }
            else
            {
                intFlag = intFlag + 100000;
                flag = String.valueOf(intFlag);
                return(flag);
            }
        }
        return flag;
    }
}
