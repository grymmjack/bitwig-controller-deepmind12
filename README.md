Behringer DeepMind12 Bitwig Studio Controller Script
====================================================

The Behringer DeepMind12 is not supported by default in Bitwig Studio, but now it is supported by adding this script.

I have submitted my controller to Bitwig, hopefully they will add it to the Community script section:
https://www.bitwig.com/en/community/control_scripts.html

I'm using Bitwig Studio v3.1.3 and the latest DeepMind12 firmware.

## Setup your DeepMind:
1. Press Global
2. Modify whichever protocol you are using (MIDI, USB, WIFI) to use CC not NRPN.
3. Exit Global

## Setup your Bitwig Studio:
1. Get the latest version of the controller: https://github.com/grymmjack/bitwig-controller-deepmind12
2. Click Clone or Download
3. Click Download Zip
4. Unzip the file to a temporary folder
5. Go into the bitwig-controller-deepmind12-master folder
6. Copy the DeepMind12 folder
7. Paste the DeepMind12 folder in your User controller location (Bitwig - Settings - Locations - User Controller Location)

## Get DeepMind12 Control into Bitwig Studio:
1. Exit Bitwig Studio if it's running
2. Open / launch Bitwig Studio
3. Choose File - Settings - Controllers
4. If your DeepMind12 is connected with USB on Windows, just click the + button on DeepMind12 that's detected.
5. Exit the settings, and if all goes well you should see a message: DeepMind12 Initialized!

## How to use in Bitwig Studio:
With this script, Bitwig will automatically lock your DeepMind12 to each device you give focus to in the UI.
When setup properly you can use the sliders on your DeepMind12 to control parameters in Bitwig without any
custom mapping required.

##Defaults (Right-handed):
Bitwig Knob 1: UNISON DETUNE
Bitwig Knob 2: VCF FREQ
Bitwig Knob 3: VCF RES
Bitwig Knob 4: VCF ENV
Bitwig Knob 5: VCF LFO
Bitwig Knob 6: VCF KYBD
Bitwig Knob 7: VCA LEVEL
Bitwig Knob 8: HPF FREQ

If you like, you can remap the sliders just put them in the order in the JS script you like in the CCs object.
