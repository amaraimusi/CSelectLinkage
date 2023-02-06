<?php 

echo "<pre>";
var_dump($_POST);
echo "</pre>";


?>

<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="google" content="notranslate" />
   	<meta http-equiv="X-UA-Compatible" content="IE=edge">
   	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>CSelectLinkage.js | ワクガンス</title>
	<link rel='shortcut icon' href='/home/images/favicon.ico' />
	
    <link href="css/bootstrap-5.0.2-dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-5.0.2-dist/font/css/open-iconic.min.css" rel="stylesheet">
	<link href="css/common2.css" rel="stylesheet">
	<script src="js/jquery3.js"></script>	<!-- jquery-3.3.1.min.js -->
    <script src="css/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
	<script src="js/CSelectLinkage.js"></script>
	<script src="js/script.js"></script>

</head>
<body>
<div id="header" ><h1>CSelectLinkage.js | ワクガンス</h1></div>
<div class="container">


<h2>Demo</h2>
<form action="#" method="post">
	<select id="animal_id" name="animal_id"  data-value="<?php echo $_POST['animal_id'] ?? 0 ?>"></select>
	
	<select id="category_id" name="category_id">
	    <option value="">-- すべて --</option>
	    <option value="1">哺乳類</option>
	    <option value="2">爬虫類</option>
	    <option value="3">両生類</option>
	    <option value="4">魚類</option>
	    <option value="5">鳥類</option>
	</select>
	<button class="btn btn-success">Submit</button>
</form>


<div class="yohaku"></div>

<ol class="breadcrumb">
	<li><a href="/">ホーム</a></li>
	<li>CSelectLinkage.js</li>
</ol>
</div><!-- content -->
<div id="footer">(C) kenji uehara 2023-2-5</div>
</body>
</html>