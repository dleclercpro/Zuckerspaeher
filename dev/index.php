<!--

Title : index.html
Author : David Leclerc
Date : 12.12.2016
Notes : -

-->

<?php require_once getcwd() . "/lib.php"; ?>

<!DOCTYPE html>

<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="refresh" content="180">
		<link rel="stylesheet" type="text/css" href="assets/css/index.min.css">
		<title>Zuckerspäher</title>
	</head>

	<body>

        <?php
            import(["name" => "header"]);
        ?>

		<main>
            <?php
                import(["name" => "user"]);
                import(["name" => "dash"]);
                import(["name" => "graph", "args" => ["BG"]]);
                import(["name" => "graph", "args" => ["I"]]);
                import(["name" => "bubble"]);
                import(["name" => "settings"]);
            ?>
		</main>

		<script type="text/javascript" src="assets/js/index.min.js"></script>
	</body>

</html>