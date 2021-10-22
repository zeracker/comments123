//package com.hsnn.bankPay.util;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.Resource;
//import javax.mail.MessagingException;
//import javax.mail.internet.MimeMessage;
//
///**
// * @description: 邮件发送
// * @create: 2020/11/19 11:47
// */
//@Component
//public class EmailUtil {
//
//    @Value("${pros.serverIp}")
//    private String host;
//    /**
//     * 系统邮箱相关
//     */
//    /**
//     * 发件人
//     */
//    @Value("${spring.mail.username}")
//    private String from;
//
//    @Resource
//    private  JavaMailSender mailSender;
//    /**
//     * HTML 文本邮件
//     * @param to 接收者邮件
//     * @param subject 邮件主题
//     * @param contnet HTML内容
//     * @throws MessagingException
//     */
//    public  void sendHtmlMail(String to, String subject, String contnet) throws MessagingException {
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true);
//        helper.setTo(to);
//        helper.setSubject(subject);
//        StringBuffer sb = new StringBuffer("【贵州省医药集中采购平台货款统一结算系统】 ");
//        sb.append(" 您正在进行邮箱验证操作，验证码："+contnet+"（验证码告知他人将导致账号被盗，请勿泄露）");
//        helper.setText(sb.toString(), true);
//        helper.setFrom(from);
//
//        mailSender.send(message);
//    }
//    /**
//     * HTML 文本邮件
//     * @param to 接收者邮件
//     * @param subject 邮件主题
//     * @throws MessagingException
//     */
//    public  void sendUpdPwdHtmlMail(String to, String subject, String code, SysUser user) throws MessagingException {
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true);
//        helper.setTo(to);
//        helper.setSubject(subject);
//        String hostIp = host+"/transition.html";
//        String url= "{userId:"+user.getUserId()+",userName:"+user.getUserName()+",code:"+code+",email:"+user.getEmail()+",type:forget}";
//        String encUrl = EncryptUtil.encode(url);
//        StringBuffer sb = new StringBuffer("【贵州省医药集中采购平台货款统一结算系统】 ");
//        sb.append(" 您好！<br/>");
//        sb.append(" 您申请的忘记密码的修改密码地址为：<br/>");
//        sb.append(hostIp+"?op="+encUrl);
//        sb.append(" 如果上面的链接地址无法点击，您也可以复制链接，粘贴到您的浏览器地址栏内，然后按‘回车’打开重置密码界面。<br>");
//        sb.append(" 如果您没有进行过忘记密码操作，请不要点击上述链接，并删除此邮件。<br>");
//        sb.append(" 谢谢！<br>");
//        System.out.println("===================================================================================");
//        System.out.println(sb.toString());
//        System.out.println("===================================================================================");
//        helper.setText(sb.toString(), true);
//        helper.setFrom(from);
//        mailSender.send(message);
//    }
//}
