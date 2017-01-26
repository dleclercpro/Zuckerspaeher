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
			<div id="user">
				<img id="user-img" src="assets/img/me.jpg">
				<div id="user-details">
					<p>Leclerc, David</p>
					<p>27.12.1991</p>
					<p>Dexcom G5</p>
					<p>MiniMed 640G</p>
					<p id="last-update">23:55 - 21.12.2016 (<span>50</span>%)</p>
				</div>
			</div>

			<div id="dash">
				<div id="dash-BG">
					<span class="BG">---</span>
					<span class="arrow"></span>
				</div>
				<div id="dash-delta">
					<p><b>&Delta;BG:</b> <span class="dBG">---</span> mmol/L</p>
					<p><b>&Delta;BG/&Delta;t:</b> <span class="dBG-dt">---</span> mmol/L/m</p>
				</div>
				<div id="dash-basal">
					<p><b>TBR:</b> <span class="TBR">---</span>%</p>
					<p><b>BR:</b> <span class="BR">---</span> U/h</p>
				</div>
				<div id="dash-on-board">
					<p><b>IOB:</b> <span class="IOB">---</span> U</p>
					<p><b>COB:</b> <span class="COB">---</span> g</p>
				</div>
				<div id="dash-factors">
					<p><b>ISF:</b> <span class="ISF">---</span> mmol/L/U</p>
					<p><b>CSF:</b> <span class="CSF">---</span> U/g</p>
				</div>
			</div>

			<div id="graph"></div>

			<div id="bubble">
				<div class="info"></div>
				<div class="time"></div>
			</div>

			<div id="settings">
				<h1>Settings</h1>

				<form>
					<div class="fieldset">
						<label>Time:</label>
						<select id="settings-hour">
							<option>00</option>
							<option>01</option>
							<option>02</option>
							<option>03</option>
							<option>04</option>
							<option>05</option>
							<option>06</option>
							<option>07</option>
							<option>08</option>
							<option>09</option>
							<option>10</option>
							<option>11</option>
							<option>12</option>
							<option>13</option>
							<option>14</option>
							<option>15</option>
							<option>16</option>
							<option>17</option>
							<option>18</option>
							<option>19</option>
							<option>20</option>
							<option>21</option>
							<option>22</option>
							<option>23</option>
						</select>
						<p>:</p>
						<select id="settings-minute">
							<option>00</option>
							<option>01</option>
							<option>02</option>
							<option>03</option>
							<option>04</option>
							<option>05</option>
							<option>06</option>
							<option>07</option>
							<option>08</option>
							<option>09</option>
							<option>10</option>
							<option>11</option>
							<option>12</option>
							<option>13</option>
							<option>14</option>
							<option>15</option>
							<option>16</option>
							<option>17</option>
							<option>18</option>
							<option>19</option>
							<option>20</option>
							<option>21</option>
							<option>22</option>
							<option>23</option>
							<option>24</option>
							<option>25</option>
							<option>26</option>
							<option>27</option>
							<option>28</option>
							<option>29</option>
							<option>30</option>
							<option>31</option>
							<option>32</option>
							<option>33</option>
							<option>34</option>
							<option>35</option>
							<option>36</option>
							<option>37</option>
							<option>38</option>
							<option>39</option>
							<option>40</option>
							<option>41</option>
							<option>42</option>
							<option>43</option>
							<option>44</option>
							<option>45</option>
							<option>46</option>
							<option>47</option>
							<option>48</option>
							<option>49</option>
							<option>50</option>
							<option>51</option>
							<option>52</option>
							<option>53</option>
							<option>54</option>
							<option>55</option>
							<option>56</option>
							<option>57</option>
							<option>58</option>
							<option>59</option>
						</select>
						<p>:</p>
						<select id="settings-second">
							<option>00</option>
							<option>01</option>
							<option>02</option>
							<option>03</option>
							<option>04</option>
							<option>05</option>
							<option>06</option>
							<option>07</option>
							<option>08</option>
							<option>09</option>
							<option>10</option>
							<option>11</option>
							<option>12</option>
							<option>13</option>
							<option>14</option>
							<option>15</option>
							<option>16</option>
							<option>17</option>
							<option>18</option>
							<option>19</option>
							<option>20</option>
							<option>21</option>
							<option>22</option>
							<option>23</option>
							<option>24</option>
							<option>25</option>
							<option>26</option>
							<option>27</option>
							<option>28</option>
							<option>29</option>
							<option>30</option>
							<option>31</option>
							<option>32</option>
							<option>33</option>
							<option>34</option>
							<option>35</option>
							<option>36</option>
							<option>37</option>
							<option>38</option>
							<option>39</option>
							<option>40</option>
							<option>41</option>
							<option>42</option>
							<option>43</option>
							<option>44</option>
							<option>45</option>
							<option>46</option>
							<option>47</option>
							<option>48</option>
							<option>49</option>
							<option>50</option>
							<option>51</option>
							<option>52</option>
							<option>53</option>
							<option>54</option>
							<option>55</option>
							<option>56</option>
							<option>57</option>
							<option>58</option>
							<option>59</option>
						</select>
					</div>
					<div class="fieldset">
						<label>Date:</label>
						<select id="settings-day">
							<option>01</option>
							<option>02</option>
							<option>03</option>
							<option>04</option>
							<option>05</option>
							<option>06</option>
							<option>07</option>
							<option>08</option>
							<option>09</option>
							<option>10</option>
							<option>11</option>
							<option>12</option>
							<option>13</option>
							<option>14</option>
							<option>15</option>
							<option>16</option>
							<option>17</option>
							<option>18</option>
							<option>19</option>
							<option>20</option>
							<option>21</option>
							<option>22</option>
							<option>23</option>
							<option>24</option>
							<option>25</option>
							<option>26</option>
							<option>27</option>
							<option>28</option>
							<option>29</option>
							<option>30</option>
							<option>31</option>
						</select>
						<p>.</p>
						<select id="settings-month">
							<option>01</option>
							<option>02</option>
							<option>03</option>
							<option>04</option>
							<option>05</option>
							<option>06</option>
							<option>07</option>
							<option>08</option>
							<option>09</option>
							<option>10</option>
							<option>11</option>
							<option>12</option>
						</select>
						<p>.</p>
						<select id="settings-year">
							<option>2015</option>
							<option>2016</option>
							<option>2017</option>
						</select>
					</div>
					<div class="fieldset">
						<label for="dx">Time step (h):</label>
						<select id="settings-dx" name="dx">
							<option>0.25</option>
							<option>0.5</option>
							<option>0.75</option>
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
							<option>6</option>
							<option>12</option>
						</select>
						<label for="dX">Time range (h):</label>
						<select id="settings-dX" name="dX">
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
							<option>5</option>
							<option>6</option>
							<option>12</option>
							<option>24</option>
							<option>48</option>
							<option>72</option>
						</select>
					</div>
					<div class="fieldset">
						<input id="settings-save" type="submit" value="Save">
					</div>
				</form>
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