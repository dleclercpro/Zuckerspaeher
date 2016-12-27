<!--

Title : index.html
Author : David Leclerc
Date : 12.12.2016
Notes : -

-->

<!DOCTYPE html>

<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" type="text/css" href="assets/css/index.css">
		<!--
		<link rel="stylesheet" type="text/css" href="assets/css/main.min.css">
		-->
		<title>MeinNS - 2016</title>
	</head>

	<body>

		<div id="loader">
			<img src="assets/img/loader.gif">
		</div>

		<header>
			<div id="branding">
				<p>MeinNS</p>
			</div>
			<div id="buttons">
				<img id="settings-button" src="assets/svg/menu.svg">
			</div>
		</header>

		<section id=content>
			<div id="user-info">
				<img id="user-picture" src="assets/img/me.png">
				<p id="user-details">
					Leclerc, David<br>
					27.12.1991<br>
					Dexcom G5<br>
					MiniMed 640G<br>
					<span id="last-update">23:55 - 21.12.2016</span>
				</p>
			</div>

			<div id="graph">
				<div id="graph-data">
					<div id="bg-info">
						<div id="bg-value"><span id="bg-number"></span> mmol/L</div>
						<div id="bg-time"></div>
					</div>
				</div>
				<div id="graph-y-axis"></div>
				<div id="graph-x-axis"></div>
				<div id="graph-corner"></div>
			</div>

			<div id="settings">
				<h1>Settings</h1>
				<select>
					<option>Test 1</option>
					<option>Test 2</option>
				</select>
				<div>Test</div>
			</div>
		</section>

		<footer></footer>

		<!-- JS -->
		<script src="assets/js/helpers/jquery-3.1.1.js"></script>
		<script src="assets/js/helpers/jquery-ui-1.12.1.js"></script>
		<script src="assets/js/mod.js"></script>
		<script src="assets/js/lib.js"></script>
		<script src="assets/js/index.js"></script>
		<!--
		<script type="text/javascript" src="assets/js/main.min.js"></script>
		-->
	</body>

</html>