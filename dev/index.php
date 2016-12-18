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
					<span id="lastUpdate">23:55 - 21.12.2016</span>
				</p>
			</div>

			<div id="graph">
				<div id="graph-data">
					<div id="bg-info">
						<div id="bg-value"></div>
						<div id="bg-time"></div>
					</div>
					<!--
					<div class="bg" x="7.75" y="2.9"></div>
					<div class="bg" x="8" y="3.5"></div>
					<div class="bg" x="8.25" y="4.2"></div>
					<div class="bg" x="8.5" y="4.7"></div>
					<div class="bg" x="8.75" y="5"></div>
					<div class="bg" x="9" y="5.5"></div>
					<div class="bg" x="9.25" y="5.7"></div>
					<div class="bg" x="9.5" y="5.6"></div>
					<div class="bg" x="9.75" y="5.9"></div>
					<div class="bg" x="10" y="6.5"></div>
					<div class="bg" x="10.25" y="5.9"></div>
					<div class="bg" x="10.5" y="6.0"></div>
					<div class="bg" x="10.75" y="6.1"></div>
					<div class="bg" x="11" y="6.3"></div>
					<div class="bg" x="11.25" y="6.2"></div>
					<div class="bg" x="11.5" y="5.1"></div>
					<div class="bg" x="11.75" y="4.2"></div>
					<div class="bg" x="12" y="4.3"></div>
					<div class="bg" x="12.25" y="5.5"></div>
					<div class="bg" x="12.5" y="6.7"></div>
					<div class="bg" x="12.75" y="8.0"></div>
					<div class="bg" x="13" y="9.9"></div>
					<div class="bg" x="13.25" y="10.5"></div>
					<div class="bg" x="13.5" y="10.4"></div>
					<div class="bg" x="13.75" y="10.0"></div>
					<div class="bg" x="14" y="9.8"></div>
					<div class="bg" x="14.25" y="9.3"></div>
					<div class="bg" x="14.5" y="8.2"></div>
					<div class="bg" x="14.75" y="7.5"></div>
					<div class="bg" x="15" y="7.2"></div>
					<div class="bg" x="15.25" y="6.8"></div>
					-->
				</div>

				<div id="graph-y-axis"></div>
				<div id="graph-x-axis"></div>
				<div id="graph-none"></div>
			</div>

			<div id="settings">
				<h1>Settings</h1>
				<div>Test</div>
				<div>Test</div>
				<div>Test</div>
				<div>Test</div>
				<div>Test</div>
			</div>
		</section>

		<footer></footer>

		<!-- JS -->
		<script src="assets/js/helpers/jquery-3.1.1.js"></script>
		<script src="assets/js/helpers/jquery-ui-1.12.1.js"></script>
		<script src="assets/js/lib.js"></script>
		<script src="assets/js/index.js"></script>
		<!--
		<script type="text/javascript" src="assets/js/main.min.js"></script>
		-->
	</body>

</html>