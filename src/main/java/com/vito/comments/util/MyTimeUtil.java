package com.vito.comments.util;

import java.io.UnsupportedEncodingException;
import java.security.SignatureException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 日期、时间操作工具类
 */
public class MyTimeUtil {

	public static String yyyy = "yyyy";
	public static String yy_MM = "yy-MM";
	public static String yyyy_MM_dd = "yyyy-MM-dd";
	public static String yyyyMMdd = "yyyyMMdd";
	public static String yyyyMM = "yyyyMM";
	public static String yyyy_MM = "yyyy-MM";
	public static String hhmmss = "HH:mm:ss";
	public static String yyyy_MM_dd_HH_mm = "yyyy-MM-dd HH:mm";
	public static String yyyyMMddHHmm = "yyyyMMddHHmm";
	public static String yyyyMMddHHmmss = "yyyyMMddHHmmss";
	public static String yyyyMMddHH_mm_ss = "yyyyMMddHH:mm:ss";
	public static String yyyyMMddHHmmssSSS = "yyyyMMddHHmmssSSS";
	public static String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss";
	public static String MM_dd_yyyy = "MM-dd-yyyy";
	public static String yyyy__MM__dd = "yyyy/MM/dd";
	public static String yyyy__MM__dd_mm_ss = "yyyy/MM/dd";
	/**
	 * 年月日
	 */
	public static String yyyyMMdd_HHmm = "yyyy年MM月dd日 HH时mm分";
	public static String yyyyMMdd_HH_mm_ss = "yyyyMMddHH:mm:ss";
	public static String yyyy_MMdd = "yyyy年MM月dd日";

	public static String getCurrentTime() {
		Date now = new Date();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(yyyy_MM_dd_HH_mm_ss);
		String str1 = simpleDateFormat.format(now);
		return str1;
	}


	//获取当前时间的前几天
	public static Date getDateBefore(int day) {
		Date d = new Date();
		Calendar now = Calendar.getInstance();
		now.setTime(d);
		now.set(Calendar.DATE, now.get(Calendar.DATE) - day);
		return now.getTime();
	}
	//获取当前时间的后几天
	public static Date getDateAfter(int day) {
		Date d = new Date();
		Calendar now = Calendar.getInstance();
		now.setTime(d);
		now.set(Calendar.DATE, now.get(Calendar.DATE) + day);
		return now.getTime();
	}

	public static String getCurrentTime2() {
		Date now = new Date();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(yyyy_MM_dd);
		String str1 = simpleDateFormat.format(now);
		return str1;
	}

	public static String getCurrentTime3() {
		Date now = new Date();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(yyyy_MM_dd_HH_mm);
		String str1 = simpleDateFormat.format(now);
		return str1;
	}

	/**
	 * 将字符串时间改成Date类型
	 * 
	 * @param format
	 * @param dateStr
	 * @return
	 */
	public static Date strToDate(String format, String dateStr) {

		Date date = null;

		try {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
			date = simpleDateFormat.parse(dateStr);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return date;
	}

	/**
	 * 将Date时间转成字符串
	 * 
	 * @param format
	 * @param date
	 * @return
	 */
	public static String DateToStr(String format, Date date) {

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);

		return simpleDateFormat.format(date);
	}

	/**
	 * 获取2个字符日期的天数差
	 * 
	 * @param p_startDate
	 * @param p_endDate
	 * @return 天数差
	 */
	public static long getDaysOfTowDiffDate(String p_startDate, String p_endDate) {

		Date l_startDate = MyTimeUtil.strToDate(MyTimeUtil.yyyy_MM_dd, p_startDate);
		Date l_endDate = MyTimeUtil.strToDate(MyTimeUtil.yyyy_MM_dd, p_endDate);
		long l_startTime = l_startDate.getTime();
		long l_endTime = l_endDate.getTime();
		long betweenDays = (long) ((l_endTime - l_startTime) / (1000 * 60 * 60 * 24));
		return betweenDays;
	}

	/**
	 * 获取2个Date型日期的分钟数差值
	 * 
	 * @param p_startDate
	 * @param p_endDate
	 * @return 分钟数差值
	 */
	public static long getMinutesOfTowDiffDate(Date p_startDate, Date p_endDate) {

		long l_startTime = p_startDate.getTime();
		long l_endTime = p_endDate.getTime();
		long betweenMinutes = (long) ((l_endTime - l_startTime) / (1000 * 60));
		return betweenMinutes;
	}

	/**
	 * 获取2个Date型日期的秒数差值
	 * 
	 * @param p_startDate
	 * @param p_endDate
	 * @return 分钟数差值
	 */
	public static long getSecondsOfTowDiffDate(String p_startDate, String p_endDate) {

		long l_startTime = MyTimeUtil.strToDate(yyyy_MM_dd_HH_mm_ss, p_startDate).getTime();
		long l_endTime = MyTimeUtil.strToDate(yyyy_MM_dd_HH_mm_ss, p_endDate).getTime();
		long betweenSeconds = (long) ((l_endTime - l_startTime) / 1000);
		return betweenSeconds;
	}

	/**
	 * 获取2个字符日期的天数差
	 * 
	 * @param
	 * @param
	 * @return 天数差
	 */
	public static long getDaysOfTowDiffDate(Date l_startDate, Date l_endDate) {

		long l_startTime = l_startDate.getTime();
		long l_endTime = l_endDate.getTime();
		long betweenDays = (long) ((l_endTime - l_startTime) / (1000 * 60 * 60 * 24));
		return betweenDays;
	}

	/**
	 * 给出日期添加一段时间后的日期
	 * 
	 * @param dateStr
	 * @param plus
	 * @return
	 */
	public static String getPlusDays(String format, String dateStr, long plus) {

		Date date = MyTimeUtil.strToDate(format, dateStr);

		long time = date.getTime() + plus * 24 * 60 * 60 * 1000;

		return MyTimeUtil.DateToStr(format, new Date(time));
	}

	/**
	 * 给出日期添加一段时间后的日期
	 * 
	 * @param
	 * @param plus
	 * @return
	 */
	public static String getPlusDays(String format, Date date, long plus) {

		long time = date.getTime() + plus * 24 * 60 * 60 * 1000;

		return MyTimeUtil.DateToStr(format, new Date(time));
	}

	/**
	 * 获取当前日期是星期几
	 * 
	 * @param dt
	 * @return 当前日期是星期几
	 * @throws ParseException
	 */
	public static String getWeekOfDate(String dt) {
		String[] weekDays = { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" };
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(new SimpleDateFormat("yyyy-MM-dd").parse(dt));
		} catch (ParseException e) {
			return "";
		}

		int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
		if (w < 0)
			w = 0;

		return weekDays[w];
	}

	/**
	 * 根据出生日期计算年龄
	 */

	public static String formatAge(String birth) {
		String age = "";
		int now = Integer.parseInt(DateToStr(yyyy, new Date()));
		int day = Integer.parseInt(birth.substring(0, 4));
		age = String.valueOf(now - day);
		return age;
	}

	/**
	 * 增加几分钟后的时间
	 */

	public static String addDateMinut(String day, int x)// 返回的是字符串型的时间，输入的
	// 是String day, int x
	{
		SimpleDateFormat format = new SimpleDateFormat(yyyyMMdd_HH_mm_ss);// 24小时制
		// 引号里面个格式也可以是 HH:mm:ss或者HH:mm等等，很随意的，不过在主函数调用时，要和输入的变
		// 量day格式一致
		Date date = null;
		try {
			date = format.parse(day);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		if (date == null)
			return "";
		// System.out.println("front:" + format.format(date)); //显示输入的日期
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.MINUTE, x);// 24小时制
		date = cal.getTime();
		// System.out.println("after:" + format.format(date)); //显示更新后的日期
		cal = null;
		return format.format(date);

	}

	/**
	 * 得到本月的第一天
	 * 
	 * @return
	 */
	public static String getMonthFirstDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMinimum(Calendar.DAY_OF_MONTH));

		return MyTimeUtil.DateToStr(yyyy_MM_dd, calendar.getTime());
	}

	/**
	 * 得到本月的最后一天
	 * 
	 * @return
	 */
	public static String getMonthLastDay() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		return MyTimeUtil.DateToStr(yyyy_MM_dd, calendar.getTime());
	}

	public static String GetSysDate(String format, String StrDate, int year, int month, int day) {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sFmt = new SimpleDateFormat(format);
		cal.setTime(sFmt.parse((StrDate), new ParsePosition(0)));

		if (day != 0) {
			cal.add(cal.DATE, day);
		}
		if (month != 0) {
			cal.add(cal.MONTH, month);
		}
		if (year != 0) {
			cal.add(cal.YEAR, year);
		}
		return sFmt.format(cal.getTime());
	}

	public static Date GetSysDate(Date StrDate, int year, int month, int day) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(StrDate);

		if (day != 0) {
			cal.add(cal.DATE, day);
		}
		if (month != 0) {
			cal.add(cal.MONTH, month);
		}
		if (year != 0) {
			cal.add(cal.YEAR, year);
		}
		return cal.getTime();
	}

	/**
	 * 将字符串时间改成Date类型
	 * 
	 * @param
	 * @param dateStr
	 * @return
	 */
	public static java.sql.Date strToSqlDate(String dateStr) {

		java.sql.Date date = null;

		try {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(yyyy_MM_dd);
			date = new java.sql.Date(simpleDateFormat.parse(dateStr).getTime());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return date;
	}

	/**
	 * 将字符串时间改成Date类型
	 * 
	 * @param format
	 * @param dateStr
	 * @return
	 */
	public static java.sql.Date strToSqlDate(String dateStr, String format) {

		java.sql.Date date = null;

		try {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
			date = new java.sql.Date(simpleDateFormat.parse(dateStr).getTime());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return date;
	}

	/**
	 * 获得指定日期的后一天
	 * 
	 * @param specifiedDay
	 * @return
	 */
	public static String getSpecifiedDayAfter(String specifiedDay) {
		Calendar c = Calendar.getInstance();
		Date date = null;
		try {
			date = new SimpleDateFormat(yyyyMMdd).parse(specifiedDay);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		c.setTime(date);
		int day = c.get(Calendar.DATE);
		c.set(Calendar.DATE, day + 1);

		String dayAfter = new SimpleDateFormat(yyyyMMdd).format(c.getTime());
		return dayAfter;
	}

	public static final int daysBetween(Date early, Date late) {

		Calendar calst = Calendar.getInstance();
		Calendar caled = Calendar.getInstance();
		calst.setTime(early);
		caled.setTime(late);
		// 设置时间为0时
		calst.set(Calendar.HOUR_OF_DAY, 0);
		calst.set(Calendar.MINUTE, 0);
		calst.set(Calendar.SECOND, 0);
		caled.set(Calendar.HOUR_OF_DAY, 0);
		caled.set(Calendar.MINUTE, 0);
		caled.set(Calendar.SECOND, 0);
		// 得到两个日期相差的天数
		int days = ((int) (caled.getTime().getTime() / 1000) - (int) (calst.getTime().getTime() / 1000)) / 3600 / 24;

		return days;
	}

	public static int daysOfTwo(Date fDate, Date oDate) {

		Calendar aCalendar = Calendar.getInstance();

		aCalendar.setTime(fDate);

		int day1 = aCalendar.get(Calendar.DAY_OF_YEAR);

		aCalendar.setTime(oDate);

		int day2 = aCalendar.get(Calendar.DAY_OF_YEAR);

		return day2 - day1;

	}



	public static final String YYYYMMDD = "yyyy-MM-dd";

	public static final String YYYYMMDD_ZH = "yyyy年MM月dd日";

	public static final int FIRST_DAY_OF_WEEK = Calendar.MONDAY; // 中国周一是一周的第一天

	/**
	 * 
	 * @param strDate
	 * @return
	 */
	public static Date parseDate(String strDate) {
		return parseDate(strDate, null);
	}

	/**
	 * parseDate
	 * 
	 * @param strDate
	 * @param pattern
	 * @return
	 */
	public static Date parseDate(String strDate, String pattern) {
		Date date = null;
		try {
			if (pattern == null) {
				pattern = YYYYMMDD;
			}
			SimpleDateFormat format = new SimpleDateFormat(pattern);
			date = format.parse(strDate);
		} catch (Exception e) {
		}
		return date;
	}

	/**
	 * format date
	 * 
	 * @param date
	 * @return
	 */
	public static String formatDate(Date date) {
		return formatDate(date, null);
	}

	/**
	 * format date
	 * 
	 * @param date
	 * @param pattern
	 * @return
	 */
	public static String formatDate(Date date, String pattern) {
		String strDate = null;
		try {
			if (pattern == null) {
				pattern = YYYYMMDD;
			}
			SimpleDateFormat format = new SimpleDateFormat(pattern);
			strDate = format.format(date);
		} catch (Exception e) {
		}
		return strDate;
	}

	/**
	 * 取得日期：年
	 * 
	 * @param date
	 * @return
	 */
	public static int getYear(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int year = c.get(Calendar.YEAR);
		return year;
	}

	/**
	 * 取得日期：月
	 * 
	 * @param date
	 * @return
	 */
	public static int getMonth(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int month = c.get(Calendar.MONTH);
		return month + 1;
	}

	/**
	 * 取得日期：日
	 * 
	 * @param date
	 * @return
	 */
	public static int getDay(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int da = c.get(Calendar.DAY_OF_MONTH);
		return da;
	}

	/**
	 * 取得当天日期是周几
	 * 
	 * @param date
	 * @return
	 */
	public static int getWeekDay(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int week_of_year = c.get(Calendar.DAY_OF_WEEK);
		return week_of_year - 1;
	}

	/**
	 * 取得一年的第几周
	 * 
	 * @param date
	 * @return
	 */
	public static int getWeekOfYear(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int week_of_year = c.get(Calendar.WEEK_OF_YEAR);
		return week_of_year;
	}

	/**
	 * getWeekBeginAndEndDate
	 * 
	 * @param date
	 * @param pattern
	 * @return
	 */
	public static String getWeekBeginAndEndDate(Date date, String pattern) {
		Date monday = getMondayOfWeek(date);
		Date sunday = getSundayOfWeek(date);
		return formatDate(monday, pattern) + " - " + formatDate(sunday, pattern);
	}

	/**
	 * 根据日期取得对应周周一日期
	 * 
	 * @param date
	 * @return
	 */
	public static Date getMondayOfWeek(Date date) {
		Calendar monday = Calendar.getInstance();
		monday.setTime(date);
		monday.setFirstDayOfWeek(FIRST_DAY_OF_WEEK);
		monday.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		return monday.getTime();
	}

	/**
	 * 根据日期取得对应周周日日期
	 * 
	 * @param date
	 * @return
	 */
	public static Date getSundayOfWeek(Date date) {
		Calendar sunday = Calendar.getInstance();
		sunday.setTime(date);
		sunday.setFirstDayOfWeek(FIRST_DAY_OF_WEEK);
		sunday.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
		return sunday.getTime();
	}

	/**
	 * 取得月的剩余天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getRemainDayOfMonth(Date date) {
		int dayOfMonth = getDayOfMonth(date);
		int day = getPassDayOfMonth(date);
		return dayOfMonth - day;
	}

	/**
	 * 取得月已经过的天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getPassDayOfMonth(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		return c.get(Calendar.DAY_OF_MONTH);
	}

	/**
	 * 取得月天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getDayOfMonth(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		return c.getActualMaximum(Calendar.DAY_OF_MONTH);
	}

	/**
	 * 取得月第一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getFirstDateOfMonth(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.set(Calendar.DAY_OF_MONTH, c.getActualMinimum(Calendar.DAY_OF_MONTH));
		return c.getTime();
	}

	/**
	 * 取得月最后一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getLastDateOfMonth(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
		return c.getTime();
	}

	/**
	 * 取得季度第一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getFirstDateOfSeason(Date date) {
		return getFirstDateOfMonth(getSeasonDate(date)[0]);
	}

	/**
	 * 取得季度最后一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getLastDateOfSeason(Date date) {
		return getLastDateOfMonth(getSeasonDate(date)[2]);
	}

	/**
	 * 取得季度天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getDayOfSeason(Date date) {
		int day = 0;
		Date[] seasonDates = getSeasonDate(date);
		for (Date date2 : seasonDates) {
			day += getDayOfMonth(date2);
		}
		return day;
	}

	/**
	 * 取得季度剩余天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getRemainDayOfSeason(Date date) {
		return getDayOfSeason(date) - getPassDayOfSeason(date);
	}

	/**
	 * 取得季度已过天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getPassDayOfSeason(Date date) {
		int day = 0;

		Date[] seasonDates = getSeasonDate(date);

		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int month = c.get(Calendar.MONTH);

		if (month == Calendar.JANUARY || month == Calendar.APRIL || month == Calendar.JULY || month == Calendar.OCTOBER) {// 季度第一个月
			day = getPassDayOfMonth(seasonDates[0]);
		} else if (month == Calendar.FEBRUARY || month == Calendar.MAY || month == Calendar.AUGUST || month == Calendar.NOVEMBER) {// 季度第二个月
			day = getDayOfMonth(seasonDates[0]) + getPassDayOfMonth(seasonDates[1]);
		} else if (month == Calendar.MARCH || month == Calendar.JUNE || month == Calendar.SEPTEMBER || month == Calendar.DECEMBER) {// 季度第三个月
			day = getDayOfMonth(seasonDates[0]) + getDayOfMonth(seasonDates[1]) + getPassDayOfMonth(seasonDates[2]);
		}
		return day;
	}

	/**
	 * 取得季度月
	 * 
	 * @param date
	 * @return
	 */
	public static Date[] getSeasonDate(Date date) {
		Date[] season = new Date[3];

		Calendar c = Calendar.getInstance();
		c.setTime(date);

		int nSeason = getSeason(date);
		if (nSeason == 1) {// 第一季度
			c.set(Calendar.MONTH, Calendar.JANUARY);
			season[0] = c.getTime();
			c.set(Calendar.MONTH, Calendar.FEBRUARY);
			season[1] = c.getTime();
			c.set(Calendar.MONTH, Calendar.MARCH);
			season[2] = c.getTime();
		} else if (nSeason == 2) {// 第二季度
			c.set(Calendar.MONTH, Calendar.APRIL);
			season[0] = c.getTime();
			c.set(Calendar.MONTH, Calendar.MAY);
			season[1] = c.getTime();
			c.set(Calendar.MONTH, Calendar.JUNE);
			season[2] = c.getTime();
		} else if (nSeason == 3) {// 第三季度
			c.set(Calendar.MONTH, Calendar.JULY);
			season[0] = c.getTime();
			c.set(Calendar.MONTH, Calendar.AUGUST);
			season[1] = c.getTime();
			c.set(Calendar.MONTH, Calendar.SEPTEMBER);
			season[2] = c.getTime();
		} else if (nSeason == 4) {// 第四季度
			c.set(Calendar.MONTH, Calendar.OCTOBER);
			season[0] = c.getTime();
			c.set(Calendar.MONTH, Calendar.NOVEMBER);
			season[1] = c.getTime();
			c.set(Calendar.MONTH, Calendar.DECEMBER);
			season[2] = c.getTime();
		}
		return season;
	}

	/**
	 * 
	 * 1 第一季度 2 第二季度 3 第三季度 4 第四季度
	 * 
	 * @param date
	 * @return
	 */
	public static int getSeason(Date date) {

		int season = 0;

		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int month = c.get(Calendar.MONTH);
		switch (month) {
		case Calendar.JANUARY:
		case Calendar.FEBRUARY:
		case Calendar.MARCH:
			season = 1;
			break;
		case Calendar.APRIL:
		case Calendar.MAY:
		case Calendar.JUNE:
			season = 2;
			break;
		case Calendar.JULY:
		case Calendar.AUGUST:
		case Calendar.SEPTEMBER:
			season = 3;
			break;
		case Calendar.OCTOBER:
		case Calendar.NOVEMBER:
		case Calendar.DECEMBER:
			season = 4;
			break;
		default:
			break;
		}
		return season;
	}

	public static String getStartTime(Date date) {
		Calendar todayStart = Calendar.getInstance();
		todayStart.setTime(date);
		todayStart.set(Calendar.HOUR_OF_DAY, -24);
		todayStart.set(Calendar.MINUTE, 0);
		todayStart.set(Calendar.SECOND, 0);
		todayStart.set(Calendar.MILLISECOND, 0);
		return DateToStr(yyyy_MM_dd_HH_mm_ss, todayStart.getTime());
	}

	public static String getEndTime(Date date) {
		Calendar todayEnd = Calendar.getInstance();
		todayEnd.setTime(date);
		todayEnd.set(Calendar.HOUR_OF_DAY, 23);
		todayEnd.set(Calendar.MINUTE, 59);
		todayEnd.set(Calendar.SECOND, 59);
		todayEnd.set(Calendar.MILLISECOND, 999);
		return DateToStr(yyyy_MM_dd_HH_mm_ss, todayEnd.getTime());
	}

	public static String getMerchantId() {
		Date date = new Date();
		DateFormat df = new SimpleDateFormat(yyyyMMddHHmmssSSS);
		return "WN" + df.format(date) + (long) (Math.random() * 10000000L);
	}



	/**
	 * @param content
	 * @param charset
	 * @return
	 * @throws SignatureException
	 * @throws UnsupportedEncodingException
	 */
	private static byte[] getContentBytes(String content, String charset) {
		if (charset == null || "".equals(charset)) {
			return content.getBytes();
		}
		try {
			return content.getBytes(charset);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("MD5签名过程中出现错误,指定的编码集不对,您目前指定的编码集是:" + charset);
		}
	}

	public static boolean checkPay(String hour, String minute) {
		boolean flag = false;
		Calendar c = Calendar.getInstance();
		// 现在的时间(单位：毫秒)
		long nowMills = c.getTimeInMillis();
		// 设置需要的时间
		c.set(Calendar.HOUR_OF_DAY, Integer.parseInt(hour));
		c.set(Calendar.MINUTE, Integer.parseInt(minute));
		long setMills = c.getTimeInMillis();
		if (setMills - nowMills <= 0) {
			flag = true;
		}
		return flag;
	}

	public static String getCurrentTimeSecond() {
		Calendar c = Calendar.getInstance();
		// 现在的时间(单位：毫秒)
		long nowMills = c.getTimeInMillis();
		return String.valueOf(nowMills).substring(0, 10);
	}

	/**
	 * 增加几分钟后的时间
	 */

	public static String addDateMinute(int x)// 返回的是字符串型的时间，输入的
	// 是String day, int x
	{
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MINUTE, x);// 24小时制
		Date d = cal.getTime();
		// System.out.println("after:" + format.format(date)); //显示更新后的日期
		cal = null;
		return DateToStr(yyyy_MM_dd_HH_mm_ss, d);

	}

	public static String getCurrentNormalDate() {
		return DateToStr(yyyy_MM_dd_HH_mm_ss, new Date());
	}

	public static String getCurrentShortDate() {
		return DateToStr(yyyy_MM_dd, new Date());
	}

	public static String getMonthS(int type) {
		String result = "";
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, type);
		result = new SimpleDateFormat(yyyy_MM).format(c.getTime());
		return result;
	}

	/**
	 * 根据开始时间和结束时间得到全部时间
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws ParseException
	 */
	public static List getStartAndEndDate(String startTime, String endTime) throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date dBegin = sdf.parse(startTime);
		Date dEnd = sdf.parse(endTime);
		List<Date> lDate = new ArrayList<Date>();
		lDate.add(dBegin);// 把开始时间加入集合
		Calendar cal = Calendar.getInstance();
		// 使用给定的 Date 设置此 Calendar 的时间
		cal.setTime(dBegin);
		boolean bContinue = true;
		while (bContinue) {
			// 根据日历的规则，为给定的日历字段添加或减去指定的时间量
			cal.add(Calendar.DAY_OF_MONTH, 1);
			// 测试此日期是否在指定日期之后
			if (dEnd.after(cal.getTime())) {
				lDate.add(cal.getTime());
			} else {
				break;
			}
		}
		lDate.add(dEnd);// 把结束时间加入集合
		List<String> timeList = new ArrayList<String>();
		for (int i = 0; i < lDate.size(); i++) {
			timeList.add(sdf.format(lDate.get(i)));
		}
		return timeList;
	}

	public static String getCurrent() {
		Date now = new Date();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(yyyy_MM_dd);
		String str1 = simpleDateFormat.format(now);
		return str1;
	}

	public static String getCurrentYYYYmmddHHmmss() {
		Date now = new Date();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(yyyy_MM_dd_HH_mm);
		String str1 = simpleDateFormat.format(now);
		return str1;
	}

	/**
	 * 判断time是否在from，to之内
	 *
	 * @param time
	 *            指定日期
	 * @param from
	 *            开始日期
	 * @param to
	 *            结束日期
	 * @return
	 */
	public static boolean belongCalendar(Date time, Date from, Date to) {
		Calendar date = Calendar.getInstance();
		date.setTime(time);

		Calendar after = Calendar.getInstance();
		after.setTime(from);

		Calendar before = Calendar.getInstance();
		before.setTime(to);

		if (date.after(after) && date.before(before)) {
			return true;
		} else {
			return false;
		}
	}

	// 强描述转换成 xx:xx:xx
	public static String secToTime(int time) {
		String timeStr = null;
		int hour = 0;
		int minute = 0;
		int second = 0;
		if (time <= 0)
			return "00:00";
		else {
			minute = time / 60;
			if (minute < 60) {
				second = time % 60;
				timeStr = unitFormat(minute) + ":" + unitFormat(second);
			} else {
				hour = minute / 60;
				if (hour > 99)
					return "99:59:59";
				minute = minute % 60;
				second = time - hour * 3600 - minute * 60;
				timeStr = unitFormat(hour) + ":" + unitFormat(minute) + ":" + unitFormat(second);
			}
		}
		return timeStr;
	}

	// 强描述转换成 xx:xx:xx
	public static String secToLongTime(Long time) {
		int times = Integer.valueOf(String.valueOf(time));
		String timeStr = null;
		int hour = 0;
		int minute = 0;
		int second = 0;
		if (time <= 0)
			return "00:00";
		else {
			minute = times / 60;
			if (minute < 60) {
				second = times % 60;
				timeStr = unitFormat(minute) + ":" + unitFormat(second);
			} else {
				hour = minute / 60;
				if (hour > 99)
					return "99:59:59";
				minute = minute % 60;
				second = times - hour * 3600 - minute * 60;
				timeStr = unitFormat(hour) + ":" + unitFormat(minute) + ":" + unitFormat(second);
			}
		}
		return timeStr;
	}

	public static String unitFormat(int i) {
		String retStr = null;
		if (i >= 0 && i < 10)
			retStr = "0" + Integer.toString(i);
		else
			retStr = "" + i;
		return retStr;
	}

	public static void main(String[] args) throws CloneNotSupportedException {
		// System.out.println(MyTimeUtil.DateToStr(yy_MM, MyTimeUtil.strToDate(MyTimeUtil.yyyy_MM, "2018-01")));
		// System.out.println(MyTimeUtil.getSecondsOfTowDiffDate("2018-07-11 13:28:03","2018-07-11 13:28:05"));
	}

}
