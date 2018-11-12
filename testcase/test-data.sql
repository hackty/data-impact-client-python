-- ddl : user_list
CREATE TABLE `user_list` (
	`id` INT (11) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR (20) NOT NULL,
	`phone` VARCHAR (11) NOT NULL,
	`sex` VARCHAR (8) NOT NULL,
	`age` INTEGER NOT NULL,
	`job` VARCHAR (100) NOT NULL,
	`loc` VARCHAR (100) NOT NULL,
	PRIMARY KEY (`id`)
);

-- func : generatePhone
CREATE FUNCTION `generatePhone`() RETURNS char(11) CHARSET utf8
    DETERMINISTIC
BEGIN
    DECLARE head VARCHAR(100) DEFAULT '000,156,136,176';
    DECLARE content CHAR(10) DEFAULT '0123456789';
    DECLARE phone CHAR(11) DEFAULT substring(head, 1+(FLOOR(1 + (RAND() * 3))*4), 3);

    #SET phone = CONCAT(phone, substring('156,136,123,456,789', 1+(FLOOR(1 + (RAND() * 4))*4), 3));

    DECLARE i int DEFAULT 1;
    DECLARE len int DEFAULT LENGTH(content);
    WHILE i<9 DO
        SET i=i+1;
        SET phone = CONCAT(phone, substring(content, floor(1 + RAND() * len), 1));
    END WHILE;

    RETURN phone;
END;

-- func : generateUserName
CREATE FUNCTION `generateUserName`() RETURNS varchar(255) CHARSET utf8
    DETERMINISTIC
BEGIN
    DECLARE xing varchar(2056) DEFAULT '赵钱孙李周郑王冯陈楮卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闽席季麻强贾路娄危江童颜郭梅盛林刁锺徐丘骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁';

    DECLARE ming varchar(2056) DEFAULT '嘉懿煜城懿轩烨伟苑博伟泽熠彤鸿煊博涛烨霖烨华煜祺智宸正豪昊然明杰诚立轩立辉峻熙弘文熠彤鸿煊烨霖哲瀚鑫鹏致远俊驰雨泽烨磊晟睿天佑文昊修洁黎昕远航旭尧鸿涛伟祺轩越泽浩宇瑾瑜皓轩擎苍擎宇志泽睿渊楷瑞轩弘文哲瀚雨泽鑫磊梦琪忆之桃慕青问兰尔岚元香初夏沛菡傲珊曼文乐菱痴珊恨玉惜文香寒新柔语蓉海安夜蓉涵柏水桃醉蓝春儿语琴从彤傲晴语兰又菱碧彤元霜怜梦紫寒妙彤曼易南莲紫翠雨寒易烟如萱若南寻真晓亦向珊慕灵以蕊寻雁映易雪柳孤岚笑霜海云凝天沛珊寒云冰旋宛儿绿真盼儿晓霜碧凡夏菡曼香若烟半梦雅绿冰蓝灵槐平安书翠翠风香巧代云梦曼幼翠友巧听寒梦柏醉易访旋亦玉凌萱访卉怀亦笑蓝春翠靖柏夜蕾冰夏梦松书雪乐枫念薇靖雁寻春恨山从寒忆香觅波静曼凡旋以亦念露芷蕾千兰新波代真新蕾雁玉冷卉紫山千琴恨天傲芙盼山怀蝶冰兰山柏翠萱乐丹翠柔谷山之瑶冰露尔珍谷雪乐萱涵菡海莲傲蕾青槐冬儿易梦惜雪宛海之柔夏青亦瑶妙菡春竹修杰伟诚建辉晋鹏天磊绍辉泽洋明轩健柏煊昊强伟宸博超君浩子骞明辉鹏涛炎彬鹤轩越彬风华靖琪明诚高格光华国源宇晗昱涵润翰飞翰海昊乾浩博和安弘博鸿朗华奥华灿嘉慕坚秉建明金鑫锦程瑾瑜鹏经赋景同靖琪君昊俊明季同开济凯安康成乐语力勤良哲理群茂彦敏博明达朋义彭泽鹏举濮存溥心璞瑜浦泽奇邃祥荣轩';

    DECLARE I_xing int DEFAULT LENGTH(xing) / 3;
    DECLARE I_ming int DEFAULT LENGTH(ming) / 3;
    DECLARE return_str varchar(2056) DEFAULT '';

    SET return_str = CONCAT(return_str, substring(xing, floor(1 + RAND() * I_xing), 1));
    SET return_str = CONCAT(return_str, substring(ming, floor(1 + RAND() * I_ming), 1));

    IF RAND() > 0.400 THEN
        SET return_str = CONCAT(return_str, substring(ming, floor(1 + RAND() * I_ming), 1));
    END IF;

    RETURN return_str;
END;

-- func : generateAge
CREATE FUNCTION `generateAge`() RETURNS int(11)
BEGIN
    DECLARE return_str INTEGER DEFAULT 18;
    SET return_str = floor(1 + RAND() * 100);
    RETURN return_str;
END;

-- func : generateSex
CREATE FUNCTION `generateSex`( ) RETURNS varchar(8) CHARSET utf8
BEGIN
	DECLARE
		return_str VARCHAR ( 8 ) DEFAULT '男';
	IF
		RAND( ) > 0.500 THEN
			SET return_str = '女';
	END IF;
RETURN return_str;
END;

-- func : generateLoc
CREATE DEFINER=`dis`@`localhost` FUNCTION `generateLoc`( ) RETURNS varchar(8) CHARSET utf8
BEGIN
	DECLARE	return_str VARCHAR ( 8 ) DEFAULT '其他地区';
	DECLARE r DOUBLE;
	SET r = RAND();
	IF
		r>0.00 AND r<=0.05 THEN
			SET return_str = '舟山市';
	END IF;
	IF
		r>0.05 AND r<=0.10 THEN
			SET return_str = '台州市';
	END IF;
		IF
		r>0.10 AND r<=0.15 THEN
			SET return_str = '丽水市';
	END IF;
		IF
		r>0.15 AND r<=0.20 THEN
			SET return_str = '绍兴市';
	END IF;
		IF
		r>0.20 AND r<=0.25 THEN
			SET return_str = '湖州市';
	END IF;
		IF
		r>0.25 AND r<=0.30 THEN
			SET return_str = '嘉兴市';
	END IF;
		IF
		r>0.30 AND r<=0.35 THEN
			SET return_str = '金华市';
	END IF;
		IF
		r>0.35 AND r<=0.40 THEN
			SET return_str = '衢州市';
	END IF;
		IF
		r>0.40 AND r<=0.50 THEN
			SET return_str = '宁波市';
	END IF;
		IF
		r>0.50 AND r<=0.70 THEN
			SET return_str = '温州市';
	END IF;
		IF
		r>0.70 AND r<=1.00 THEN
			SET return_str = '杭州市';
	END IF;
RETURN return_str;
END;

-- func : generateJob
CREATE DEFINER=`dis`@`localhost` FUNCTION `generateJob`( ) RETURNS varchar(8) CHARSET utf8
BEGIN
	DECLARE	return_str VARCHAR ( 8 ) DEFAULT '未知类别';
	DECLARE r DOUBLE;
	SET r = RAND();
	IF
		r>0.00 AND r<=0.05 THEN
			SET return_str = 'IT/互联网';
	END IF;
	IF
		r>0.05 AND r<=0.10 THEN
			SET return_str = '金融业';
	END IF;
		IF
		r>0.10 AND r<=0.15 THEN
			SET return_str = '房地产业/建筑业';
	END IF;
		IF
		r>0.15 AND r<=0.20 THEN
			SET return_str = '商务服务业';
	END IF;
		IF
		r>0.20 AND r<=0.25 THEN
			SET return_str = '生活服务业';
	END IF;
		IF
		r>0.25 AND r<=0.30 THEN
			SET return_str = '文化/传媒/广告';
	END IF;
		IF
		r>0.30 AND r<=0.35 THEN
			SET return_str = '快速消费品';
	END IF;
		IF
		r>0.35 AND r<=0.40 THEN
			SET return_str = '耐用消费品';
	END IF;
		IF
		r>0.40 AND r<=0.45 THEN
			SET return_str = '制造业';
	END IF;
		IF
		r>0.45 AND r<=0.50 THEN
			SET return_str = '汽车制造/维修/零配件';
	END IF;
		IF
		r>0.50 AND r<=0.55 THEN
			SET return_str = '通信/电子/半导体';
	END IF;
		IF
		r>0.55 AND r<=0.60 THEN
			SET return_str = '贸易/批发/零售';
	END IF;
		IF
		r>0.60 AND r<=0.65 THEN
			SET return_str = '医疗/医药';
	END IF;
		IF
		r>0.65 AND r<=0.70 THEN
			SET return_str = '教育/培训/科研';
	END IF;
		IF
		r>0.70 AND r<=0.75 THEN
			SET return_str = '能源/矿产/电力';
	END IF;
		IF
		r>0.75 AND r<=0.80 THEN
			SET return_str = '交通/物流/仓储';
	END IF;
			IF
		r>0.80 AND r<=0.85 THEN
			SET return_str = '农林牧渔';
	END IF;
			IF
		r>0.85 AND r<=0.90 THEN
			SET return_str = '政府/机构/组织';
	END IF;
	IF
			r>0.90 AND r<=0.95 THEN
			SET return_str = '学生';
	END IF;

RETURN return_str;
END;

-- procedure : add_user
CREATE  PROCEDURE `add_user`(IN n int)
BEGIN
  DECLARE i INT DEFAULT 1;
    WHILE (i <= n ) DO
      INSERT INTO user_list (username, phone, sex, age, job, loc) VALUES (generateUserName(), generatePhone(), generateSex(), generateAge(), generateJob(), generateLoc());
			SET i=i+1;
    END WHILE;
END;

-- call : add_user
CALL add_user(10000);

-- rand insert
CREATE TABLE user_list_1 AS SELECT username, phone, sex, age FROM user_list WHERE id >= ((SELECT MAX(id) FROM user_list)-(SELECT MIN(id) FROM user_list)) * RAND() + (SELECT MIN(id) FROM user_list) LIMIT 8500;
CREATE TABLE user_list_2 AS SELECT phone, job, loc FROM user_list WHERE id >= ((SELECT MAX(id) FROM user_list)-(SELECT MIN(id) FROM user_list)) * RAND() + (SELECT MIN(id) FROM user_list) LIMIT 5500;


