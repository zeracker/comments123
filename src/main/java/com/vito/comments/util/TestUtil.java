package com.vito.comments.util;

import javax.sql.DataSource;

import com.vito.comments.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * 单元测试工具
 * 
 * @author Administrator
 *
 */

@RunWith(SpringRunner.class)
@SpringBootTest(classes = { Application.class })
public class TestUtil {

	@Autowired
    private RedisTemplate redisTemplate;
	
	@Autowired
	private DataSource dataSource;


//	@Autowired
//	private SysBankReqResLogDao sysBankReqResLogDao;
//	@Autowired
//	private TbInvoiceScDao tbInvoiceScDao;
	
	@Test
	public void test() {
//		SysBankReqResLog log  = new SysBankReqResLog();
//		String uidMain = UUID.randomUUID().toString();
//		uidMain = uidMain.replace("-","");
//		log.setLogId(uidMain);
//		sysBankReqResLogDao.insert(log);
//		BankPayBillTask BankPayBillTask = new BankPayBillTask();
//		BankPayBillTask.configureTasks();
	}

}
