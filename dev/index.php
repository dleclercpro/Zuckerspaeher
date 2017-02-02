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

		<main>
			<div id="user">
				<img id="user-img" src="assets/img/me.jpg">
				<div id="user-details">
					<p id="user-name">Leclerc, David</p>
					<p id="user-birthday">27.12.1991</p>
					<p id="user-cgm">Dexcom G5</p>
					<p id="user-pump">MiniMed 640G</p>
					<p id="user-status">23:55 - 21.12.2016 (<span>50</span>%)</p>
					<p id="user-live">
						<span id="user-BG" class="last-BG">---</span>
						<span id="user-arrow" class="last-arrow"></span>
					</p>
				</div>
			</div>

			<div id="dash">
				<div id="dash-live">
					<span id="dash-BG" class="last-BG">---</span>
					<span id="dash-arrow" class="last-arrow"></span>
				</div>
				<div id="dash-delta">
					<p><b>&Delta;BG:</b> <span id="dash-dBG">---</span> mmol/L</p>
					<p><b>&Delta;BG/&Delta;t:</b> <span id="dash-dBG-dt">---</span> mmol/L/m</p>
				</div>
				<div id="dash-basal">
					<p><b>TBR:</b> <span id="dash-TBR">---</span>%</p>
					<p><b>BR:</b> <span id="dash-BR">---</span> U/h</p>
				</div>
				<div id="dash-on-board">
					<p><b>IOB:</b> <span id="dash-IOB">---</span> U</p>
					<p><b>COB:</b> <span id="dash-COB">---</span> g</p>
				</div>
				<div id="dash-factors">
					<p><b>ISF:</b> <span id="dash-ISF">---</span> mmol/L/U</p>
					<p><b>CSF:</b> <span id="dash-CSF">---</span> U/g</p>
				</div>
				<div id="dash-age">
					<p><b>SAGE:</b> <span id="dash-SAGE">---</span> h</p>
					<p><b>CAGE:</b> <span id="dash-CAGE">---</span> h</p>
				</div>
			</div>

			<div id="graph-BG"></div>
			<div id="graph-I"></div>

			<div id="bubble">
				<div id="bubble-info"></div>
				<div id="bubble-time"></div>
			</div>

			<div id="settings">
				<h1>Settings</h1>

				<form>
					<div class="fieldset">
						<label>Time:</label>
						<select id="settings-hour">
						<?php
							for ($i = 0; $i < 24; $i++) { 
								echo "<option>" . $i . "</option>";
							}
						?>
						</select>
						<p>:</p>
						<select id="settings-minute">
						<?php
							for ($i = 0; $i < 60; $i++) { 
								echo "<option>" . $i . "</option>";
							}
						?>
						</select>
						<p>:</p>
						<select id="settings-second">
						<?php
							for ($i = 0; $i < 60; $i++) { 
								echo "<option>" . $i . "</option>";
							}
						?>
						</select>
					</div>
					<div class="fieldset">
						<label>Date:</label>
						<select id="settings-day">
						<?php
							for ($i = 1; $i <= 31; $i++) { 
								echo "<option>" . $i . "</option>";
							}
						?>
						</select>
						<p>.</p>
						<select id="settings-month">
						<?php
							for ($i = 1; $i <= 12; $i++) { 
								echo "<option>" . $i . "</option>";
							}
						?>
						</select>
						<p>.</p>
						<select id="settings-year">
						<?php
							for ($i = 2015; $i <= 2017; $i++) { 
								echo "<option>" . $i . "</option>";
							}
						?>
						</select>
					</div>
					<div class="fieldset">
						<label for="dx">Time step (h):</label>
						<select id="settings-dx" name="dx">
							<?php
							$dx = [0.25, 0.5, 0.75, 1, 2, 3, 4, 6, 12];

							foreach ($dx as $i) {
								echo "<option>" . $i . "</option>";
							}
							?>
						</select>
						<label for="dX">Time range (h):</label>
						<select id="settings-dX" name="dX">
						<?php
						$dX = [1, 2, 3, 4, 5, 6, 12, 24, 48, 72];

						foreach ($dX as $i) {
							echo "<option>" . $i . "</option>";
						}
						?>
						</select>
					</div>
					<div class="fieldset">
						<input id="settings-save" type="submit" value="Save">
					</div>
				</form>
			</div>
		</main>

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