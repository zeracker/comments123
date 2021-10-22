package com.vito.comments.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;

/**
 * 分布式锁工具类
 */
@Component
public class DistrubutedLockUtil {
    private static final Logger log = LoggerFactory.getLogger(DistrubutedLockUtil.class);

    private static String prefix = "redis_lock_";


    @Autowired
    private RedisTemplate redisTemplate;

    private static DistrubutedLockUtil lock;


    @PostConstruct
    public void init(){
        lock = this;
        lock.redisTemplate = this.redisTemplate;
    }
    /**
     * 获取分布式锁
     *@param lockKey        锁住的key
     * @param lockExpireMils 锁住的时长。如果超时未解锁，视为加锁线程死亡，其他线程可夺取锁 ，单位ms
     * @return true 获取锁成功  false 获取锁失败
     */
    public static synchronized boolean lock(String lockKey ,long lockExpireMils ){

       if( lock.redisTemplate.opsForValue().setIfAbsent(prefix + lockKey , Thread.currentThread().getName() + Thread.currentThread().getId() , lockExpireMils , TimeUnit.MILLISECONDS)){
            return true;
       }else{
          Object operid = lock.redisTemplate.opsForValue().get(prefix + lockKey);//比较是否当前线程id
          if(operid == null){
              return false;
          }else{
              //判断可重入 ，是当前线程重试的则可再次进入
              if((Thread.currentThread().getName() + Thread.currentThread().getId()).equals(operid) ){
                  lock.redisTemplate.opsForValue().set(prefix + lockKey , Thread.currentThread().getName() + Thread.currentThread().getId() , lockExpireMils , TimeUnit.MILLISECONDS);
                  return true;
              }
              return false;
          }
       }
//        return (boolean)lock.redisTemplate.execute((RedisCallback) connection ->{
//            long nowTime = System.currentTimeMillis();
//            //获取时间毫秒值
//            long expireAt = nowTime + lockExpireMils + 1;
//            //获取锁
//            Boolean acquire = connection.setNX(lockKey.getBytes(), String.valueOf(expireAt).getBytes());
//            if(acquire){
//                return true;
//            }else{
//                byte[] value = connection.get(lockKey.getBytes());
//                if (Objects.nonNull(value) && value.length > 0) {
//                    long oldTime = Long.parseLong(new String(value));
//                    if (oldTime < nowTime) {
//                        //connection.getSet：返回这个key的旧值并设置新值。
//                        byte[] oldValue = connection.getSet(lockKey.getBytes(), String.valueOf(expireAt).getBytes());
//                        //当key不存时会返回空，表示key不存在或者已在管道中使用
//                        return oldValue == null ? false : Long.parseLong(new String(oldValue)) < nowTime;
//                    }
//                }
//
//            }
//            return false;
//        });
    }

    /**
     * 释放锁
     * @param lockKey
     */
    public static void deleteLock(String lockKey){
         lock.redisTemplate.delete(lockKey);
    }

}
