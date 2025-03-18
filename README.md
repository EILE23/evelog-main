
<br/>

## 블로그 만들기

<br/>

### [velog](https://velog.io/) 


<hr/>

## 팀원
[안상현](https://github.com/EILE23) <br/>
[이주형](https://github.com/hellojuhyoung)


<hr/>



## 목차

1. [로그인](#로그인-회원가입-시-user-데이터를-db에-저장) 
2. [개인 블로그](#개인-블로그) 
3. [게시물](#게시물) 
4. [읽기 목록](#읽기-목록)
5. [Search](#search)
6. [내 정보](#내-정보)

<br/><br/>
<hr/>

###  기술스택
<br/>

<span>
<img src = "https://img.shields.io/badge/javascript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img src = "https://img.shields.io/badge/ejs-B4CA65?style=flat-square&logo=ejs&logoColor=black"/>
  <img src = "https://img.shields.io/badge/CSS-663399?style=flat-square&logo=CSS&logoColor=black"/>
   <img src = "https://img.shields.io/badge/node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=black"/>
   <img src = "https://img.shields.io/badge/MySql-4479A1?style=flat-square&logo=MySQL&logoColor=black"/>
   <img src = "https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/>
</span>

<br/><br/>



<hr/>

### 게시물
<br/>

글 작성

![image](https://github.com/user-attachments/assets/9504544a-864a-4fe0-b1fe-30534f5fdb69)

![image](https://github.com/user-attachments/assets/803fe11a-c75c-47a2-9479-4344c4352475)



해당하는 게시물들을 메인 페이지에 게시

![image](https://github.com/user-attachments/assets/f860353b-df6e-43c4-9ed7-ff6b9d6ea62a)


<br/><br/>



작성자의 프로필, 헤더가 나타나고
게시물을 누르면 해당 게시물의 글과 작성자이면 수정, 삭제 가능하게 끔 버튼 표기 <br/>
만약 아니면 해당하는 게시물의 하트아이콘만 나타나게 변동 <br/>
댓글은 추가 댓글 까지만 작성이 가능하다

<br/><br/>
<hr/>


### 로그인 회원가입 시 USER 데이터를 DB에 저장
<br/>

![image](https://github.com/user-attachments/assets/eb5fd91b-905b-4c72-9d39-02646186e3e9)



로그인 이후 글을 쓰면 메인 페이지에 해당 글이 게시되고 자신의 블로그가 만들어지도록 하고  <br/>
타인의 블로그를 들어가면 타인의 블로그로 들어가지도록 렌더링 <br/>
해당하는 DB의 게시글을 불러와서 보여주기



<br/><br/>

### 개인 블로그
<br/>

![image](https://github.com/user-attachments/assets/308968f8-f74f-4a97-8b41-8cfb2ec4423e)


![image](https://github.com/user-attachments/assets/94a71a34-06fd-416b-bf38-d984d3349696)


자신이 작성한 게시물들은 개인 블로그에 게시 대표 이미지를 누르면 해당 글로 이동

<br/><br/>
<hr/>


### 읽기 목록



해당하는 글의 하트를 누르면 좋아한 페이지에 등록,
최근 읽은 페이지는 쿠키에 넣어 값을 불러오게끔 작성

### Search

<br/>

![search](https://github.com/user-attachments/assets/157f0a58-6e63-44ef-9b92-e8497d287884)

검색 페이지는 해당하는 게시물에 게시물이 있으면 나타나고 없으면 나타나지 않게 제한

### 내 정보

<br/>

![image](https://github.com/user-attachments/assets/649dc205-ad17-4922-b0df-638cd025c039)




회원 정보 업데이트

#### 반응형 디자인

![image](https://github.com/user-attachments/assets/932f25e1-e264-4310-973b-d59bf5169a26)

페이지가 작아지면 작아질 수록 갯수를 줄여서 표기



### 디자인
디자인은 전부 velog를 따라서 작성


### DB 설계도

![erd](https://github.com/user-attachments/assets/92a2f91a-82e6-4c87-9907-d0240661067d)



### 사용 라이브러리, API

#### 로그인 연동
>[네이버 로그인](https://nid.naver.com/user2/campaign/introNaverIdLogin)
>[카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
>[구글 로그인](https://cloud.google.com/identity-platform/docs/web/google?hl=ko)

#### 게시판 글 작성
>[toastEditor](https://ui.toast.com/)

#### 모듈
>[Express](https://expressjs.com/ko/)


