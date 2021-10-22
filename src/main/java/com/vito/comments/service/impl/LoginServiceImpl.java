//package com.hsnn.bankPay.service.impl;
//
//
//import java.math.BigDecimal;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.concurrent.TimeUnit;
//
////import javax.sql.DataSource;
//
//import com.hsnn.bankPay.entity.base.ParamObject;
//import com.hsnn.bankPay.service.LoginService;
//import com.hsnn.bankPay.util.StringUtil;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.PropertySource;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//import org.apache.commons.codec.digest.DigestUtils;
//
//
////import com.hsnn.bankPay.std.dao.StdCompinfoDao;
////import com.hsnn.bankPay.std.dao.StdHealthbureauDao;
////import com.hsnn.bankPay.std.entity.StdCompinfo;
////import com.hsnn.bankPay.std.entity.StdHealthbureau;
////import com.hsnn.bankPay.sys.dao.SysUserDao;
////import com.hsnn.bankPay.sys.entity.SysUser;
//import com.hsnn.bankPay.util.gzca.GZCA;
//
//
//@Service("loginService")
//@PropertySource("classpath:application.yml")
//public class LoginServiceImpl implements LoginService {
//    private static final Logger log = LoggerFactory.getLogger(LoginServiceImpl.class);
//    @Autowired
//    private RedisTemplate redisTemplate;
//
////    @Autowired
//////    private DataSource dataSource;
//
////    @Autowired
////    private SysUserDao sysUserDao;
////
////    //zbc添加   用于查询用户对应的 orgId 对应的名称
////    @Autowired
////    private StdCompinfoDao compinfoDao;
////
////    @Autowired
////    private StdHealthbureauDao healthbureauDao;
//
//
//    @Value("${caUrl}")
//	private String CAURL;
//	@Value("${caUserName}")
//	private String CAUSERNAME;
//    @Value("${pros.serverIp}")
//    private String serverIp;
//
//    @Value("${loginCa}")
//    private String loginCa;
//
//    @Value("${checkAnswer}")
//    private String checkAnswer;
//
//    /**
//     * 用户登录验证
//     * @throws Exception
//     */
//    @Override
//    public Object login(ParamObject po) throws Exception {
//        //从redis获取查询实体   查询结果
//        String userName = (String) po.getValue("username");
//        String passWord = (String) po.getValue("password");
//        String answer = (String) po.getValue("answer");
//        String verifyCodeText = (String) po.getSession().getAttribute("verifyCodeText");
//
//
//        log.info("用户名："+userName+"密码:"+passWord);
//        if(userName == null) {
//            po.setMsg("用户名不能为空");
//            throw new Exception("用户名不能为空");
//        }
//        if(passWord == null) {
//            po.setMsg("密码不能为空");
//            throw new Exception(" 密码不能为空");
//        }
//        if("true".equals(checkAnswer)){
//            if(StringUtil.isEmpty(verifyCodeText)){
//                po.setMsg("验证码已过期，请点击验证码刷新");
//                throw new Exception(" 验证码已过期，请点击验证码刷新");
//            }
//            if(answer == null) {
//                po.setMsg("验证码不能为空");
//                throw new Exception(" 验证码不能为空");
//            }
//            log.info("session缓存验证文本:"+verifyCodeText);
//            verifyCodeText = verifyCodeText.toLowerCase();
//            answer = answer.toLowerCase();
//            if(!answer.equals(verifyCodeText)) {
//                po.setMsg("验证码错误");
//                throw new Exception(" 验证码错误");
//            }
//            po.getSession().removeAttribute("verifyCodeText");
//        }
//
//        String encodedPwd = DigestUtils.md5Hex(passWord);
////        SysUser userinfo = new SysUser();
////        userinfo.setUserName(userName);
////        userinfo.setUserPassword(encodedPwd);
////        List<SysUser> list = sysUserDao.list(userinfo);
////        SysUser newUser = null;
////        StdHealthbureau healthbureau = new StdHealthbureau();
////        if(list.size() > 0){
////            newUser = list.get(0);
////            if("2".equals(newUser.getRoleId()) && (newUser.getAcctType()).compareTo(BigDecimal.ZERO)==0 && "true".equals(loginCa)){
////                po.setMsg("请使用CA登录");
////                throw new Exception("请使用CA登录!");
////            }
////            healthbureau = healthbureauDao.getOne(newUser.getOrgId());
////        }else{
////            po.setMsg("用户名或者密码错误");
////            throw new Exception("用户名或者密码错误!");
////        }
////
////        redisTemplate.opsForValue().set(newUser.getUserId() , newUser , 30 , TimeUnit.MINUTES);
//////        redisTemplate.opsForSet().add("userinfo",newUser);
////        po.getSession().setAttribute("userinfo",newUser);
////        newUser.setLastLoginTime(new Date());//更新最后登录时间
////        sysUserDao.update(newUser);
////        // 把当前新创建的user用户传递到前台
////        StdCompinfo compinfo = compinfoDao.getById(newUser.getOrgId());
//        //添加结果到返回对象
//        Map res = new HashMap<String, Object>();
//        res.put("state", "201");
////        if (compinfo != null){
////            res.put("compName", compinfo.getCompName());
////        }
////        if (newUser.getUserType().intValue() == 6){
////            res.put("areaId", healthbureau.getAreaId());
////        }
////        res.put("username", userName+" ("+newUser.getName()+")");
////        res.put("orgid", newUser.getOrgId());
////        res.put("usertype", newUser.getUserType());
////        res.put("acctType", newUser.getAcctType());
////        res.put("MD5CODE", newUser.getUserPassword());
//        res.put("serverIp", serverIp);
//        po.setMsg("登录成功");
//        return res;
//    }
//
//    public static void main(String[] args) {
//        System.out.println(DigestUtils.md5Hex("123456"));
//    }
//
//    /**
//     *
//     * @param po
//     * @return 用户退出登录
//     * @throws Exception
//     */
//    @Override
//    public Object loginOut(ParamObject po) throws Exception {
//        //从redis获取查询实体   查询结果
//        log.info("用户退出登录!");
//        Object userObject = po.getSession().getAttribute("userinfo");
////        SysUser userInfo = (SysUser) userObject;
////        if(userInfo != null){
////            redisTemplate.delete(userInfo.getUserId());
////            po.getSession().removeAttribute("userinfo");
////            po.getSession().removeAttribute("cakey");
////        }
//
//        //添加结果到返回对象
//        Map res = new HashMap<String, Object>();
//        res.put("state", "202");
//        return res;
//    }
//
////    @Override
////    public Object loginCa(ParamObject po) throws Exception {
////        String guid = (String) po.getValue("guid");
////        String signature = (String) po.getValue("signature");
////        String serialnumber = (String) po.getValue("serialnumber");
////
////        Map res = new HashMap<String, Object>();
////        //证书B64
////        String certb64 = signature;
////        //签名原文，随机数，由服务器生成
////        String randNum = guid;
////        //签名结果，由客户端上传
////        //服务器地址，需要配置测试环境
////		String url = CAURL;
////        //应用名，需要联系CA管理员查询
////		String appname = CAUSERNAME;
////        //签名证书序列号，从客户端获取
////        GZCA ca = new GZCA(url,appname);
////        String resultKey = ca.VerifySign(serialnumber,guid,signature);
////        //1.验证该证书返回是否是200
////        log.info("返回："+resultKey);
////        String[] strKey = resultKey.split("\\|");
////        if(!strKey[0].equals("200")){
////            po.setMsg("该Key验证不通过");
////            throw new Exception("用户名或者密码错误!");
////        }
////        SysUser user = sysUserDao.getByCaKey(serialnumber);
////        if(user!=null){
////            redisTemplate.opsForValue().set(user.getUserId() , user , 30 , TimeUnit.MINUTES);
////            po.getSession().setAttribute("userinfo",user);
////            user.setLastLoginTime(new Date());//更新最后登录时间
////            sysUserDao.update(user);
////            //添加结果到返回对象
////            res.put("state", "201");
////            res.put("usertype", user.getUserType());
////            res.put("username", user.getUserName()+" ("+user.getName()+")");
////            res.put("serverIp", serverIp);
////            res.put("orgid", user.getOrgId());
////            res.put("acctType", user.getAcctType());
////            res.put("MD5CODE", user.getUserPassword());
////            po.getSession().setAttribute("cakey",user.getCaKey());
////            res.put("cakey", user.getCaKey());
////            po.setMsg("登录成功");
////            return res;
////        }else{
////            throw new Exception("该key未绑定用户");
////        }
////    }
//
//
//    /**
//     * 获取当前登录用户信息
//     * @param po
//     * @return
//     * @throws Exception
//     */
////    public Object getMyInfo(ParamObject po) throws Exception {
////        return po.getUser();
////    }
//
//
//
//
//}
