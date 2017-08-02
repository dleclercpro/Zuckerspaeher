<div id="settings">
    <p>Settings</p>

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