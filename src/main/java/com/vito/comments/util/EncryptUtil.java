package com.vito.comments.util;

public class EncryptUtil {

    public static void main(String[] args) {
        String str = "03F00Y03602T03803103702V00Y01M00YJZJFKORKYGGLKCPRN300X00Y01800Y03602T03802R03302S02T00Y01M00Y01901D00Y03H";
        System.out.println(decode(str));

        System.out.println(encode("{\"method\":\"P001\",\"userID\":\"Bank0001\"}"));

    }

//    //定义密钥，36个字母和数字
//    var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//    var l = key.length;  //获取密钥的长度
//    var b, b1, b2, b3, d = 0, s;  //定义临时变量
//    s = new Array(Math.floor(str.length / 3));  //计算加密字符串包含的字符数，并定义数组
//    b = s.length;  //获取数组的长度
//		    for (var i = 0; i < b; i ++) {  //以数组的长度循环次数，遍历加密字符串
//        b1 = key.indexOf(str.charAt(d));  //截取周期内第一个字符串，计算在密钥中的下标值
//        d ++;
//        b2 = key.indexOf(str.charAt(d));  //截取周期内第二个字符串，计算在密钥中的下标值
//        d ++;
//        b3 = key.indexOf(str.charAt(d));  //截取周期内第三个字符串，计算在密钥中的下标值
//        d ++;
//        s[i] = b1 * l * l + b2 * l + b3  //利用下标值，反推被加密字符的Unicode编码值
//    }
//    b = eval("String.fromCharCode(" + s.join(',') + ")"); // 用fromCharCode()算出字符串
    public static String decode(String encodeStr){
        String key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int l = key.length();
        int[] s = new int[Math.round(encodeStr.length()/3)];
        int  b = s.length , b1 , b2 ,b3 , d = 0 ;
        for (int i =0 ; i < b; i++){
            b1 = key.indexOf(encodeStr.charAt(d));
            d++;
            b2 = key.indexOf(encodeStr.charAt(d));
            d++;
            b3 = key.indexOf(encodeStr.charAt(d));
            d++;
            s[i] = b1 * l * l + b2 * l + b3;
        }

        StringBuffer sb = new StringBuffer("");
        for(int i = 0 ;i < s.length ;i ++){
            if (s[i] < 128){
                sb.append((char)s[i]);
            }else{
                sb.append(new Character((char) s[i]));
            }

        }
//        System.out.println(Arrays.toString(s));
        return sb.toString();
    }

    public static String encode(String encodeStr){
        String foekkocoodokkrfjoidjovfoijgboiobgjowkwelkrlqe = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int l = foekkocoodokkrfjoidjovfoijgboiobgjowkwelkrlqe.length();
        String[] a = foekkocoodokkrfjoidjovfoijgboiobgjowkwelkrlqe.split("");
        String s ="";
        int b,b1,b2,b3;
        for (int i = 0; i < encodeStr.length(); i++) {
            b = encodeStr.charAt(i);
            b1 = b % l;
            b = (b - b1) / l;
            b2 = b % l;
            b = (b - b2) / l;
            b3 = b % l;
            s += a[b3] + a[b2] + a[b1];
        }

        StringBuffer sb = new StringBuffer("");
        for(int i = 0 ;i < s.length() ;i ++){
            if (s.charAt(i) < 128){
                sb.append(s.charAt(i));
            }else{
                sb.append(new Character( s.charAt(i)));
            }
        }
        return sb.toString();
    }

}
