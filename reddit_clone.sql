-- MySQL dump 10.16  Distrib 10.1.11-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: reddit_clone
-- ------------------------------------------------------
-- Server version	10.1.11-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `contentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parentId` (`parentId`),
  KEY `userId` (`userId`),
  KEY `contentId` (`contentId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`contentId`) REFERENCES `contents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'People on reddit telling other on people on reddit about the Chinese market also forget to mention that when it went up before last year it was even higher in 2007, so the rally that it crashed from was a recovery rally.\nThis means this crash confirms the recovery in the market prior to last year was a \'dead cat\' rally.\nstock market is not the same as economy.\nThey are very strongly related. Stress on the word strongly. One would never find a stock market in the gutter for an economy that\'s booming and never find a stock market booming in an economy in the gutter.\nThere\'s an element of expectation in the markets of what the economy will be, before it happens.','2016-02-25 19:47:07','2016-02-25 19:47:07',NULL,18,24),(2,'You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.You\'re both right.\nChina\'s economy is falling apart. As the CPC dynasty provided metrics are rather useless, this is backed up by economies reliant on trade with China. Singapore, Australia, and South Korea have all had rather extreme slides in exports. That, and the oil slide, is the smoke that indicates China is burning.\nHowever, the Chinese stock market doesn\'t have nearly as much capital in it as the US\'s so when it crashes, the effect that that has on the economy is far far less. Most companies get their liquidity through state-owned banks and so there isn\'t the same credit crunch either, nor is it affecting the average Chinese consumer the same as sayyy if your 401k went up in smoke from a US stock market crash.\nThus, their stock exchange is more an indicator, albeit a rather flawed one, that China\'s in trouble, rather than something actively contributing to said trouble.','2016-02-25 19:48:13','2016-02-25 19:48:13',1,18,24),(3,'Not true.','2016-02-25 20:05:05','2016-02-25 20:05:05',2,18,24),(4,'True.','2016-02-25 20:08:26','2016-02-25 20:08:26',3,18,24);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentvotes`
--

DROP TABLE IF EXISTS `commentvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commentvotes` (
  `upVote` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `commentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`commentId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `commentvotes_ibfk_1` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commentvotes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentvotes`
--

LOCK TABLES `commentvotes` WRITE;
/*!40000 ALTER TABLE `commentvotes` DISABLE KEYS */;
INSERT INTO `commentvotes` VALUES (1,'2016-02-25 21:15:00','2016-02-25 21:15:01',1,18),(1,'2016-02-25 21:15:03','2016-02-25 21:15:03',2,18),(1,'2016-02-25 21:14:32','2016-02-25 21:14:36',4,18);
/*!40000 ALTER TABLE `commentvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contents`
--

DROP TABLE IF EXISTS `contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contents`
--

LOCK TABLES `contents` WRITE;
/*!40000 ALTER TABLE `contents` DISABLE KEYS */;
INSERT INTO `contents` VALUES (1,'youtube1','title1','2016-02-18 01:00:48','2016-02-18 01:00:49',1),(2,'youtube2','title2','2016-02-18 01:00:49','2016-02-18 01:00:49',1),(3,NULL,NULL,'2016-02-18 01:18:15','2016-02-18 01:18:15',1),(4,NULL,NULL,'2016-02-18 16:09:22','2016-02-18 16:09:22',5),(5,NULL,NULL,'2016-02-18 16:35:52','2016-02-18 16:35:52',5),(6,NULL,NULL,'2016-02-18 16:37:28','2016-02-18 16:37:28',5),(7,'http://www.google.ca','jimbo','2016-02-18 16:39:36','2016-02-18 16:39:36',5),(8,'http://www.google.ca','jimmy','2016-02-18 16:41:32','2016-02-18 16:41:32',5),(9,'http://test.ca','test','2016-02-18 18:59:15','2016-02-18 18:59:15',7),(10,'','','2016-02-18 23:35:03','2016-02-18 23:35:03',1),(11,'http://www.google.ca','some content','2016-02-19 01:09:50','2016-02-19 01:09:50',5),(12,'http://www.finebros.com','im a man','2016-02-19 03:40:36','2016-02-19 03:40:36',5),(13,'http://www.circletheory.com','some crazy shiz','2016-02-19 15:56:27','2016-02-19 15:56:27',1),(14,'http://www.google.ca','straight to da top','2016-02-19 17:37:54','2016-02-19 17:37:54',5),(15,'http://www.google.fr','latest and greatest','2016-02-19 17:43:15','2016-02-19 17:43:15',5),(16,'testcreation','http://www.google.de','2016-02-19 20:52:28','2016-02-19 20:52:28',5),(17,'http://www.majimbo.com','majimbo','2016-02-19 20:55:02','2016-02-19 20:55:02',5),(18,'http://www.reddit.com/r/fullcommunism','sweet posts','2016-02-20 02:08:32','2016-02-20 02:08:32',1),(19,'http://www.markcrisp.com','dingaling','2016-02-22 15:23:25','2016-02-22 15:23:25',1),(20,'http://www.google.com','theseconddingaling','2016-02-22 16:48:54','2016-02-22 16:48:54',1),(21,'http://www.google.ca','thethirddingaling','2016-02-22 16:50:38','2016-02-22 16:50:38',1),(22,'http://www.google.ca','> test','2016-02-23 19:03:11','2016-02-23 19:03:11',15),(23,'https://wikileaks.org/nsa-201602/','WikiLeaks publishes docs showing that the NSA bugged meetings between Ban Ki-Moon and Merkel, Netanyahu, Berlusconi, between key EU and Japanese ministers discussing their secret trade red-lines at WTO negotiations, as well as details of a private meeting','2016-02-23 22:06:32','2016-02-23 22:06:32',5),(24,'http://www.reddit.com','This site is stealing from us!','2016-02-25 17:01:02','2016-02-25 17:01:02',18);
/*!40000 ALTER TABLE `contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,'4ad8517348b7f054683a73d046448f5bc337825eb9afac4b5179af87bf21143d854c8bf2585f7f4e','2016-02-17 21:50:13','2016-02-17 21:50:13',1),(2,'35b4a7b38a3cc492353122eb331f724d498572ffc4fcbded254d89a0b7d304cf6055a1bbc8667e','2016-02-17 22:04:05','2016-02-17 22:04:05',1),(3,'c91ebfcf6fad55cf71a941775433358fa91f961e51614fa5cd1fe89d259ad2d35bd3f87174648','2016-02-17 22:05:08','2016-02-17 22:05:08',1),(4,'ed4d41ca583af8d12f5bf1c2fe3dcd335f8ef9231ce9fdeee971b8d7ada6e8d4482e3ca47ef7','2016-02-17 22:06:29','2016-02-17 22:06:29',1),(5,'fdf024c4bf13a97b6fa394d9e8985c869ded9665f6259fd9aa13fc53c70fe5c1d57a96de1620','2016-02-17 22:06:45','2016-02-17 22:06:45',1),(6,'8d4c14447f2d642a1a787ab5387c3137c35c0595c63bf67acd890fcc25651a82a45cf7032a11b','2016-02-17 22:07:35','2016-02-17 22:07:35',1),(7,'69b52d20643d91e599bdfb1f17828d49197c498f62faeb237cb589a3425da97c3869a52e503e','2016-02-17 22:08:29','2016-02-17 22:08:29',1),(8,'e5c13b6ced6b674c09fae2c9ddc687f3db7d335265416395e07038ca9fff589efcd17a985bdb9','2016-02-17 22:08:47','2016-02-17 22:08:47',1),(9,'a5baa7f764ae158c36f7cd0c28cbe39db5fffa2d18e469b2bde24b18ebd4fdfb7c83bbe76991995','2016-02-17 23:19:24','2016-02-17 23:19:24',1),(10,'9b4a7f6a5acc523970c172b9cd4cb25ba658c45ff92dc2f38f3aa54b5d6bbf9b7496d5dbfc4491f','2016-02-18 01:17:50','2016-02-18 01:17:50',1),(11,'4f3bc2b12c75de7e8f7c182d11be2367747d748503e5c396d890283ea7977d70273cf0a1b22','2016-02-18 16:07:49','2016-02-18 16:07:49',5),(12,'f5bee853b26b224ff3d091a4307071f968a16aab24c79ef3de4d4468cf624dbc77f89dfb128bd','2016-02-18 16:41:40','2016-02-18 16:41:40',1),(13,'79952499d79f3490235e32dc39591689e19abef34d554e70871bc6c954d8af1c19d3298e1e810a5','2016-02-18 18:58:34','2016-02-18 18:58:34',7),(14,'1c92a742ceacd11f77c2c847717dabacca8bf8939435f28e2dc45829447d9ccba9494abcac2ca44','2016-02-18 19:10:49','2016-02-18 19:10:49',1),(15,'c0ec5f36c85d7ada865282ae84af7e0c87a7268cda85e3499e81218833a59d68303b9c5f90ee','2016-02-18 19:13:48','2016-02-18 19:13:48',7),(16,'f9a8d36bdc42762baa54b49eecddc48edeee9bbf6bf0afdf9068601ff5b7ccbaa557cb1a4d9d9e','2016-02-18 19:14:02','2016-02-18 19:14:02',7),(17,'de3276e36ea5c3e6207c6e9d6fe68a48a8bc5e070ad9c496f762e4ac332e0e8e09a342358a8','2016-02-18 19:14:59','2016-02-18 19:14:59',7),(18,'8513b1876a81b323cdec437c53e78fd3f9c30aabc6d5c3e89dab1d49da6c4ebff778fa57da98','2016-02-18 20:32:13','2016-02-18 20:32:13',1),(19,'d218b12e8e546cff18a43c42126b06d15ba9c74c2ebb322ca597228eefb1648e931e84214d4a','2016-02-18 20:38:00','2016-02-18 20:38:00',1),(20,'7c2d8a2f7686feb3e3a93bd94d7a23b58264fef12f85c8bdb37fe36e9e85d2fe9ee37f5e6b7e6','2016-02-18 20:53:23','2016-02-18 20:53:23',1),(21,'45ea3c54e333dc36776b2daa97c8543be9ae50c5c783937a8d9c3e90d926755386e8a6e38244664','2016-02-18 20:55:07','2016-02-18 20:55:07',1),(22,'54fd2037766cd4967f5a3fe75d36f5cd655c850cf87f48aef65c51e8b7bec32726f42ebcbbd5e0','2016-02-18 22:11:34','2016-02-18 22:11:34',1),(23,'31d02dea2a4cee9a03f2987306352fd57eb7379b2f07464f36ff09d48988f4db5db59a319','2016-02-18 22:11:41','2016-02-18 22:11:41',1),(24,'7512e7f8e5c59fc330fbbc7d9a4cedc553d486ddeace2e830eeded2dddd451fde5c12a579581e54','2016-02-18 23:26:38','2016-02-18 23:26:38',1),(25,'41d934b234ab7d23a759331e409b2fe1428ea4f1f2dbacbfcf9eda8a9cfaec6eb384fead12927','2016-02-19 01:09:29','2016-02-19 01:09:29',5),(26,'b1e157e75cbcd3a6304d66bde251a161e38f4aa7a062ed2d580309e42fe40c7cb955843bceef7c6','2016-02-19 01:10:29','2016-02-19 01:10:29',1),(27,'4b3af5f0f9534c43c0fffab165304c7afa7abb81b6b8bf563bb7c2d71f769de3ea6d6ebd0571bc2','2016-02-19 02:46:53','2016-02-19 02:46:53',1),(28,'5327eabffd4dd14289140ca0e146fd21e7fb81a1a7610bc57e7a32c5c71a2f63a95de3a52f8','2016-02-19 03:01:35','2016-02-19 03:01:35',5),(29,'72216f5f3a4b73ad01ce9ae4d684eb83d87f663ebcff1874a48f2e0a1aa108878d571a28798b0','2016-02-19 03:02:46','2016-02-19 03:02:46',5),(30,'a289164a642ee33519631c624b8ced4c356f28080d8b39c8a7b1c97cf47f41ea7ac7abd33bbd','2016-02-19 03:03:02','2016-02-19 03:03:02',5),(31,'62721819e6bebfcfc157dfbfe1ae78e06f5d87df52962025c019358ef7aa6ed68542a8ff339843e','2016-02-19 03:03:16','2016-02-19 03:03:16',1),(32,'d2ebad1cf01119c0b8f1123e36570b71520e37b4594d41baeb2f85b594f5b8d79daed087d459','2016-02-19 03:10:57','2016-02-19 03:10:57',5),(33,'7314ac55664ac79238725cd6410f9fac732e24f7575544627e953bb3dd4cd1dd8f73d1d9995c44','2016-02-19 03:12:29','2016-02-19 03:12:29',9),(34,'e6492ba4d2d8e8195e97ecb05f3ae6342c4e6f2e0d44e904af0befb277c7f4250f22f4496279a8','2016-02-19 03:26:57','2016-02-19 03:26:57',1),(35,'fa4c39c16bb3c0cf3e327a5c5a8ed5ee28ddd759c04b41e86186a822fc8241c4283b78f37d6','2016-02-19 03:39:25','2016-02-19 03:39:25',9),(36,'9893da1165ed7eae42fffef7310266f471c23c894ec21166328437bbc44305c4a87382f4943da5','2016-02-19 03:39:44','2016-02-19 03:39:44',5),(37,'83ee21fbaf26b6c76f35a4da4b22db19c5c1acd48a676e04021dc8f4e6ea248e4b9a298990','2016-02-19 03:42:23','2016-02-19 03:42:23',10),(38,'4a83ad3c5587d6ebe1ab97baaaa3b5241935537e53e65e11b80ca23cc37441ba81726e21869d6','2016-02-19 03:44:19','2016-02-19 03:44:19',10),(39,'cee393ab558218e86f963ed311e7a286df7aa76f99285fa5cd9bfc59526dff9c1141870b55c44','2016-02-19 04:11:20','2016-02-19 04:11:20',1),(40,'ce2a6de26f355ffa05574fb865a990c67dd9eab0665d4f872b5f3c9d321ba4f2ef4fa1eb9811d3','2016-02-19 05:13:43','2016-02-19 05:13:43',5),(41,'1147876375bafc329dc34cd6f0b94137eda2e2a4dcc36dc1eabde7462bba959c2364af2c496e2','2016-02-19 05:14:07','2016-02-19 05:14:07',1),(42,'3d1b4bceb3a8e298712014635e8cd67a1d59538128a6a4467ecf6f1c5c72d9eda23f3d779c1ff72','2016-02-19 05:14:25','2016-02-19 05:14:25',5),(43,'86a523dd69c2111c586208e7117d71b6bc2cc6cf4dac7e8b7f25eced51cda5e64c51aefe9655','2016-02-19 05:20:50','2016-02-19 05:20:50',1),(44,'eaa7a891195e63d82bf3a6a2897421ebcadda8d5df97e4b2677f30579dc1604ceb59ecf3921c9e','2016-02-19 14:54:44','2016-02-19 14:54:44',1),(45,'61ca6f247cf5ea60816eb2a3ae2e877bf211f6e586f9c327cabac9fe1e5028a5fe8513b46726c2','2016-02-19 16:34:15','2016-02-19 16:34:15',1),(46,'204767d620916ca6655ebb6f1d5b96b3b488a1bf44bd729c3a92b3a230ead2cefc43d8c6edc363','2016-02-19 16:52:43','2016-02-19 16:52:43',1),(47,'fce136cfe6d94c688a08efc56ccd83b84cc5fe166f2f1f9019c2d8aa6257ec919be0a35ce1aea4','2016-02-19 16:53:10','2016-02-19 16:53:10',11),(48,'f06f1c6189feb8a2f2f84e2c1c5bc4e01ec7d94fbb4d7186a67078b1c1b45adf495578a4db304c','2016-02-19 17:04:42','2016-02-19 17:04:42',1),(49,'2e9272ad38166814a3972cf1a52cf417bacec7f3673d43bcd61c2d151e36392de2f3ce812c825','2016-02-19 17:04:54','2016-02-19 17:04:54',5),(50,'fc43a2d2e5297fc5af628a77ccfc8f7268b5f3fbdbe2dbf1135b3eafa8b55e49eb3e65761922','2016-02-19 23:38:49','2016-02-19 23:38:49',1),(51,'e8328d7f252a363a41e0f7fa373733756777929a30e6ca5ac4c6675f89104b5a895a1d8d4925203a','2016-02-20 01:36:35','2016-02-20 01:36:35',1),(52,'142c82a02bbdb0f4fb3e4fdc82cbf3c536050b39ab81937f5b46b98c31d4d67ddbda9a4cfc3ec','2016-02-20 02:12:44','2016-02-20 02:12:44',13),(53,'7a76691117852f546f96d35155fce0fcdfee6db26ed98b21bfbefdd77203e883267462822ac728','2016-02-20 02:28:55','2016-02-20 02:28:55',1),(54,'a7f1a7bf268eca9c9a6449971647dd5ebe732ed4f0407f161eb514ef5b1be647b84fcb7be7ab8','2016-02-20 02:40:16','2016-02-20 02:40:16',1),(55,'f690d48682ad9deed94a7a1848adf76f5d4ac87a0d4fdc817c14ed88085e7a8ce37afb8a4c976','2016-02-20 04:34:47','2016-02-20 04:34:47',11),(56,'81382cc8eeae4d8752a6b7badbdf03a8c5060f2071cb5ff24bf79aafc52869e97c2256e6e465','2016-02-22 15:21:50','2016-02-22 15:21:50',1),(57,'e15ebf5dc84ceb4a9db9fc5eb388be07c2439ae66754bdf4d46f8e647c5d36df28646de18f47','2016-02-22 18:05:01','2016-02-22 18:05:01',1),(58,'ce995a11ff68fe2485911dd4e7d4abad3ffebcaf8597ccd0e24d64546d52cc23cf604f51b2ae','2016-02-22 20:30:03','2016-02-22 20:30:03',14),(59,'92eaedf079d91a8f4a1dbfd227931811954985bf7e6910bfff7d55e6c964dd0c0b1e771dcdab7df','2016-02-22 21:18:56','2016-02-22 21:18:56',1),(60,'268d87adda2acc38568af9814a3c8fd3c1230a7f1cb2e65fe3a1a233eff18332e806104a45603a','2016-02-23 15:23:51','2016-02-23 15:23:51',1),(61,'e3ce50a2bf35fe5dc88642501135ee12cd2f75718a11cb49aaf97fa9716799abf3991ebeb0','2016-02-23 15:48:38','2016-02-23 15:48:38',1),(62,'7de095f624e9b481b12fcc285cea977e2747425d74f8c5f8498074c6ffe2a953684db81541cafa','2016-02-23 18:35:14','2016-02-23 18:35:14',5),(63,'caeef78b5163fe8ae2924f3d084ba7c302cf0213df8bd26a1e3b18b67f4ce726999537be95fcb66','2016-02-23 19:01:25','2016-02-23 19:01:25',15),(64,'331f59d9df971fea2196fbcc46668c5e3261616745381f7dddc22417d3dd1e67acd4dc2eb57f','2016-02-23 20:29:10','2016-02-23 20:29:10',1),(65,'d633dde277832e648ed17fdba7f39f1814b58c9bf815fd7af396b39c8d91cb725b37b7c44a292','2016-02-23 21:59:17','2016-02-23 21:59:17',5),(66,'4734b207b3e729b48b0b3bbce32101915a67abd2347d6a45e89c7b56a4acdea78c58e417f8e290','2016-02-23 23:12:15','2016-02-23 23:12:15',1),(67,'7cb6f1b567fa6af14f3a1ad135b561424b5964b761766fb27990f439cfd811e85d68db3ba3e57f0','2016-02-24 03:52:22','2016-02-24 03:52:22',1),(68,'26bafd61632c9f5f07a41725242218947885ce3cdb41e184961ce4c5e149a91580b5d4644ea','2016-02-24 04:04:09','2016-02-24 04:04:09',1),(69,'f663b416af354b6d2785793b95a47a4f436c47d51e8a99dc5f0af6b25123f786639512143623','2016-02-24 19:47:47','2016-02-24 19:47:47',16),(70,'5ece28c0b0aaa0badf583a5caa20851aeaac895f7d22eb146723cd61459e76a65c143df7e0f7','2016-02-24 21:06:51','2016-02-24 21:06:51',1),(71,'d7f360d513d8468d2a3d92ee3b18eaaabb739f561aecd12941313268589708f1b4ac33ec2fe88ff','2016-02-24 23:22:39','2016-02-24 23:22:39',17),(72,'d8f8e7e85856e6967716897721425bf9d82953a66dde4b1f4e8dd6df773c36f20ab30561a44dd','2016-02-24 23:25:07','2016-02-24 23:25:07',17),(73,'6b5eb5af1a0346379667531459e67a61037c4c5aacf83ee2e426512da763a0e8dc985233ee764','2016-02-24 23:29:02','2016-02-24 23:29:02',1),(74,'95dae6fc8a69a1bff98878b9d596976eeffbc518b3db05cfaf6ad8c1f38a77b33f6f3449bae6ba6','2016-02-25 05:05:16','2016-02-25 05:05:16',1),(75,'7d2632ee454f44ec7a7a23639b9fc69debefcec5aa1177a4f8c3414f4cb7b1b3ff857c48886bbd','2016-02-25 05:05:21','2016-02-25 05:05:21',1),(76,'d538c517dc105cdf9d6216f278b4af2380d368d128ca5a45c63061e9e6fb84b2c6085fd7e17','2016-02-25 05:05:21','2016-02-25 05:05:21',1),(77,'b47076c4a5b4e2e1d1aafda079edc6a44749f49ec6973c2eeffd9a11e49c5f8e1684cc5e2d23ea6','2016-02-25 05:05:38','2016-02-25 05:05:38',1),(78,'f4efe4f194f60fc12b4e2cf241c19a6249b5de562c495c637ececf1ec9b9d21ebd6155f72e63f4','2016-02-25 05:05:54','2016-02-25 05:05:54',1),(79,'6eda579122c2f9ff792e345ea1d4c3618146ae67e1e0ce992d5889b2da9c1cfc3a6588cf33ee9a12','2016-02-25 05:08:05','2016-02-25 05:08:05',1),(80,'5bd1cb4c7d2095d9f64094a29c74aabd6555637aef2097f171ec95fe4bf4f6aca7843a7e0cb23','2016-02-25 05:08:28','2016-02-25 05:08:28',1),(81,'46a47e4aaefeb63954e259a6d85adbf92266f14e1480964c398f4b5b923bece391f5389acb8bb4','2016-02-25 16:06:03','2016-02-25 16:06:03',1),(82,'6a598c62ffbcdff2075c3955e2569bf17a9a549ecac1839e84554dcdb2f8817156d3cb274fa427','2016-02-25 17:00:23','2016-02-25 17:00:23',18),(83,'326edc64fc3bfdfb52f52cb4276662331bcf42bbc286c5e47bf8375599465364cea527da5ea192','2016-02-25 17:49:18','2016-02-25 17:49:18',1),(84,'6965a982d98d9d415c81208587efa17185841d96fdcad5c6ad0391615b9ad47c65c433472339886','2016-02-25 17:49:32','2016-02-25 17:49:32',1),(85,'f4c1c57e9eaa7e9559c046505ac3db8debbda85b8b14b52e2da6adeb332696ec91712535cbe88','2016-02-25 17:50:07','2016-02-25 17:50:07',5),(86,'a2dfca2c824726dbd5a8469dd9e15a9c2df66a5dc877726d96670bf852b7799a797573719313e8','2016-02-25 19:35:22','2016-02-25 19:35:22',18);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jimothy','$2a$10$TpY4U8McOSfGDdDwtbmTneUGHLHDw9m7DW628G2098973Az03frGC','andy','2016-02-17 20:43:10','2016-02-17 20:43:10'),(5,'bobert','$2a$10$xQr7VCD/RG70cyH6MuH21uDaJ13/LrtyE58nqUBQqtlNRxtRqM326','andydingaling','2016-02-18 16:06:33','2016-02-18 16:06:33'),(6,'andrew_bernard','$2a$10$/FTZPHK0ybN.LkilbUkceuExsOGBi65AKG7OKTa3pdRuEA0l1WWy2','narddog88@gmail.com','2016-02-18 16:14:44','2016-02-18 16:14:44'),(7,'66','$2a$10$y8Rs1gtBj7fOaLCRQmakmO3KugveEUEtNTDPD.akF82ZWg4tuuob6','','2016-02-18 18:58:34','2016-02-18 18:58:34'),(9,'newaccount','$2a$10$g4WUjibGgEPKa2GO0n2zfukGJXm5/YizPMl0GF/OpM4RMNb/Pbp52','','2016-02-19 03:12:29','2016-02-19 03:12:29'),(10,'majortom','$2a$10$meT0VYG5V5duFgHakaALs.z5dSqVtt.0Zf2GMvf3E5uGgczB/v9au','','2016-02-19 03:42:22','2016-02-19 03:42:22'),(11,'hector','$2a$10$D4RCerW3reTOCyXfWLO4FOID/pq6J.pdzJ49skbplHZVLUvO5U.jq','bigmuscles@gmail.com','2016-02-19 16:53:10','2016-02-19 16:53:10'),(12,'john','$2a$10$6g1BsgHtuTEBJ2v4en06EucIfB7urK3jlEqIijW57/MJwhVuFjRDy','hullabaloo','2016-02-20 01:41:41','2016-02-20 01:41:41'),(13,'jimborino','$2a$10$BDU/v5jkpejbVl6RVFeyvOoqypOCmXhXy1Q6oXUwZfT0e3fV4O/lW','thejimber','2016-02-20 02:12:44','2016-02-20 02:12:44'),(14,'jabingo','$2a$10$UDynWO0CgFf6.bd5IVF0u.94bg.Xh8IfPySVzvC3VWSLyawf9WZo6','jiminy@gmail.com','2016-02-22 20:30:03','2016-02-22 20:30:03'),(15,'77','$2a$10$cwz/0YTjEU71Nc/4HdtJfO1J.FCrjAs5cY0BLmbGFF1WYI.lVT3ha','','2016-02-23 19:01:25','2016-02-23 19:01:25'),(16,'jonny','$2a$10$FUBpfNIylPn5QOZRPkWHbO0pUaZxZ12B2sMDaykPrxSNivCJCraJO','n','2016-02-24 19:47:47','2016-02-24 19:47:47'),(17,'batman','$2a$10$1be4BtMLhBclfHouJ1C1su/KAOg5QlRsI5ud1EWob6GvZjhOHyCEa','','2016-02-24 23:22:38','2016-02-24 23:22:38'),(18,'julio','$2a$10$zhxg9IanP8fk2ya3SIHT.OCNHoS5rvG/f7gkK6JT8IVS0Jwyrowa2','','2016-02-25 17:00:22','2016-02-25 17:00:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `upVote` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `contentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`contentId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`contentId`) REFERENCES `contents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (1,'2016-02-18 23:34:10','2016-02-23 23:29:11',1,1),(0,'2016-02-19 03:01:43','2016-02-23 23:09:01',1,5),(1,'2016-02-19 16:56:59','2016-02-19 17:02:59',1,11),(1,'2016-02-18 23:34:07','2016-02-19 16:37:51',2,1),(1,'2016-02-19 03:01:39','2016-02-23 23:09:06',2,5),(1,'2016-02-18 21:29:42','2016-02-22 16:39:19',3,1),(1,'2016-02-19 17:25:19','2016-02-23 23:09:03',3,5),(1,'2016-02-19 03:50:46','2016-02-19 03:50:46',3,10),(1,'2016-02-18 23:34:04','2016-02-24 23:29:21',4,1),(0,'2016-02-19 17:25:21','2016-02-23 23:09:05',4,5),(1,'2016-02-18 20:36:09','2016-02-23 23:29:57',5,1),(1,'2016-02-23 22:04:17','2016-02-23 23:08:48',5,5),(1,'2016-02-18 21:29:08','2016-02-19 05:28:39',6,1),(0,'2016-02-19 03:02:29','2016-02-19 03:39:56',6,5),(0,'2016-02-23 19:10:24','2016-02-23 19:10:24',6,15),(0,'2016-02-18 23:28:46','2016-02-23 21:38:54',7,1),(1,'2016-02-19 17:25:17','2016-02-23 22:07:20',7,5),(0,'2016-02-19 03:50:39','2016-02-19 03:50:39',7,10),(1,'2016-02-18 20:32:24','2016-02-24 23:29:17',8,1),(1,'2016-02-19 03:02:27','2016-02-19 03:41:51',8,5),(1,'2016-02-18 20:32:15','2016-02-24 23:29:19',9,1),(1,'2016-02-19 03:02:23','2016-02-19 17:08:48',9,5),(0,'2016-02-19 05:13:23','2016-02-23 21:41:58',10,1),(1,'2016-02-19 03:02:20','2016-02-19 17:04:58',10,5),(1,'2016-02-19 03:01:17','2016-02-25 04:46:33',11,1),(0,'2016-02-19 03:02:47','2016-02-19 19:59:11',11,5),(1,'2016-02-19 03:26:40','2016-02-19 03:26:40',11,9),(1,'2016-02-19 03:50:35','2016-02-19 03:50:35',11,10),(1,'2016-02-19 16:53:15','2016-02-19 16:53:15',11,11),(1,'2016-02-19 05:13:27','2016-02-25 01:52:54',12,1),(0,'2016-02-19 05:13:48','2016-02-23 22:03:25',12,5),(1,'2016-02-19 16:44:07','2016-02-23 21:41:26',13,1),(1,'2016-02-19 19:59:08','2016-02-23 23:08:44',13,5),(1,'2016-02-19 16:53:48','2016-02-19 16:53:48',13,11),(1,'2016-02-20 01:02:19','2016-02-22 16:39:13',14,1),(1,'2016-02-19 17:37:55','2016-02-19 22:24:30',14,5),(0,'2016-02-23 21:39:25','2016-02-23 21:39:27',15,1),(0,'2016-02-19 17:43:15','2016-02-19 23:33:21',15,5),(1,'2016-02-20 01:02:33','2016-02-25 04:46:31',16,1),(1,'2016-02-19 20:52:28','2016-02-23 22:28:59',16,5),(1,'2016-02-20 01:02:11','2016-02-23 21:58:56',17,1),(1,'2016-02-19 20:55:02','2016-02-23 22:28:57',17,5),(1,'2016-02-20 04:34:56','2016-02-20 04:34:56',17,11),(1,'2016-02-20 02:12:49','2016-02-20 02:12:49',17,13),(1,'2016-02-23 19:05:46','2016-02-23 19:05:46',17,15),(1,'2016-02-25 17:00:34','2016-02-25 17:00:34',17,18),(1,'2016-02-20 02:08:32','2016-02-25 15:00:02',18,1),(0,'2016-02-23 21:59:29','2016-02-23 22:28:55',18,5),(1,'2016-02-20 02:12:56','2016-02-20 02:12:56',18,13),(0,'2016-02-22 15:23:25','2016-02-25 16:05:20',19,1),(0,'2016-02-23 21:59:24','2016-02-23 22:28:54',19,5),(0,'2016-02-22 20:30:43','2016-02-22 20:31:51',19,14),(0,'2016-02-25 17:03:52','2016-02-25 17:03:52',19,18),(1,'2016-02-22 16:48:54','2016-02-25 01:32:53',20,1),(1,'2016-02-23 22:01:19','2016-02-23 23:09:08',20,5),(1,'2016-02-22 20:30:09','2016-02-22 20:30:09',20,14),(1,'2016-02-22 16:50:38','2016-02-23 21:58:06',21,1),(0,'2016-02-23 18:41:32','2016-02-23 22:28:50',21,5),(1,'2016-02-22 20:32:07','2016-02-22 20:32:09',21,14),(1,'2016-02-23 20:29:12','2016-02-25 05:35:07',22,1),(0,'2016-02-23 22:07:02','2016-02-23 22:28:48',22,5),(1,'2016-02-23 19:03:11','2016-02-23 19:05:30',22,15),(1,'2016-02-24 03:52:31','2016-02-25 15:57:02',23,1),(1,'2016-02-23 22:06:32','2016-02-23 22:06:32',23,5),(1,'2016-02-25 17:03:48','2016-02-25 17:03:48',23,18),(1,'2016-02-25 17:49:23','2016-02-25 17:49:23',24,1),(1,'2016-02-25 17:01:02','2016-02-25 17:01:02',24,18);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-25 16:30:24
