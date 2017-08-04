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
		<link rel="stylesheet" type="text/css" href="assets/css/index.css">
		<!-- <link rel="stylesheet" type="text/css" href="assets/css/main.min.css">	-->
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
                import(["name" => "graph",
                    "args" => [
                        "Type" => "BG",
                        "X" => false,
                        "Y" => true,
                        "NA" => false
                    ]
                ]);
                import(["name" => "graph",
                    "args" => [
                        "Type" => "I",
                        "X" => false,
                        "Y" => true,
                        "NA" => false
                    ]
                ]);
                import(["name" => "bubble"]);
                import(["name" => "settings"]);
            ?>
		</main>

		<!-- JS -->
		<script src="assets/js/helpers/jquery-3.1.1.js"></script>
		<script src="assets/js/mod.js"></script>
		<script src="assets/js/lib.js"></script>
		<script src="assets/js/index.js"></script>
		<!-- <script type="text/javascript" src="assets/js/main.min.js"></script> -->
	</body>

</html>