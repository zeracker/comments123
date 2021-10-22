package com.vito.comments.cnf;

import java.time.Duration;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@AutoConfigureAfter(RedisAutoConfiguration.class)
public class RedisConfigration {

//	@Bean
//	public RedisTemplate<Object, Object> redisTemplate(
//			RedisConnectionFactory redisConnectionFactory)
//					throws UnknownHostException {
//		RedisTemplate<Object, Object> template = new RedisTemplate<Object, Object>();
//		template.setConnectionFactory(redisConnectionFactory);
////		System.err.println("//设置jackson为序列化");
//		//设置jackson为序列化
//		GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer();
//		template.setDefaultSerializer(serializer);
//
//		return template;
//	}
	
	@Bean
	public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory ) {
		RedisCacheConfiguration conf = RedisCacheConfiguration.defaultCacheConfig();
		conf = conf
				.entryTtl(Duration.ofMinutes(30l))//默认30分钟
				.disableCachingNullValues()//null不缓存
				.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))// 设置key序列器
				.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));//设置value序列器
		return RedisCacheManager.builder(RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory)).cacheDefaults(conf).build();
		
	}

	@Bean
	public RedisTemplate<String , Object> redisCacheTemplate(LettuceConnectionFactory redisConnectionFactory){
		RedisTemplate<String , Object> template = new RedisTemplate<>();
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		template.setConnectionFactory(redisConnectionFactory);
		return template;
	}

}
