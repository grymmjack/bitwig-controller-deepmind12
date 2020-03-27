loadAPI(10);
host.setShouldFailOnDeprecatedUse(true);
host.defineController("Behringer", "DeepMind12", "0.1", "82f0ae68-a502-4114-a265-c3112cd6a10d", "grymmjack");
host.defineMidiPorts(1, 1);
host.defineSysexIdentityReply("f0 7e ?? 06 01 00 20 32 20 00 01 00 ?? 00 ?? ?? F7 01 F7");

var SYSEX_HEADER = "F0 7E 7F 06 01 F7";

var OLD_MS   = MS;
var MS       = (new Date()).getMilliseconds();
var NRPN_NUM = 0;
var NRPN_VAL = 0;

var NRPN_NUMS = {
   19: 'SAW',
   18: 'PULSE',
   20: 'SYNC',
   51: '2 POLE',
   50: 'INVERT',
   52: 'BOOST'
}

var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ];

var CC = {
   MOD_WHEEL            : 1,
	ARP_RATE             : 12,
	ARP_GATE_TIME        : 13,
	LFO1_RATE            : 16,
	LFO1_DELAY_TIME      : 17,
	LFO2_RATE            : 18,
	LFO2_DELAY_TIME      : 19,
	OSC1_PITCH_MOD       : 20,
	OSC1_PWM             : 21,
	OSC2_PITCH_MOD       : 23,
	OSC2_TONE_MOD        : 24,
	OSC2_PITCH           : 25,
   OSC2_LEVEL           : 26,
	NOISE_LEVEL          : 27,
	UNISON_DETUNE        : 28,
	VCF_FREQ             : 29,
   VCF_RES              : 30,
   VCF_ENV              : 31,
   VCF_LFO              : 33,
   VCF_KYBD             : 34,
   VCA_LEVEL            : 36,
   HPF_FREQ             : 35,
   ENV_VCA_A            : 37,
   ENV_VCA_D            : 39,
   ENV_VCA_S            : 40,
   ENV_VCA_R            : 41,
   ENV_VCF_A            : 42,
   ENV_VCF_D            : 43,
   ENV_VCF_S            : 44,
   ENV_VCF_R            : 45,
   ENV_MOD_A            : 46,
   ENV_MOD_D            : 47,
   ENV_MOD_S            : 48,
   ENV_MOD_R            : 49,
   ENV_CURVES_VCA_A     : 50,
   ENV_CURVES_VCA_D     : 51,
   ENV_CURVES_VCA_S     : 52,
   ENV_CURVES_VCA_R     : 53,
   ENV_CURVES_VCF_A     : 54,
   ENV_CURVES_VCF_D     : 55,
   ENV_CURVES_VCF_S     : 56,
   ENV_CURVES_VCF_R     : 57,
   ENV_CURVES_MOD_A     : 58,
   ENV_CURVES_MOD_D     : 59,
   ENV_CURVES_MOD_S     : 60,
   ENV_CURVES_MOD_R     : 61,
   PORTAMENTO           : 5
};

CC_MAP = [];
for (var key in CC) {
   CC_MAP[CC[key]] = key;
}

if (host.platformIsWindows()) {
   host.addDeviceNameBasedDiscoveryPair(["DeepMind12"], ["DeepMind12"]);
}
else if (host.platformIsMac())
{
   host.addDeviceNameBasedDiscoveryPair(["DeepMind12"], ["DeepMind12"]);
}
else if (host.platformIsLinux())
{
   host.addDeviceNameBasedDiscoveryPair(["DeepMind12"], ["DeepMind12"]);
}

function init() {
   transport = host.createTransport();
   host.getMidiInPort(0).setMidiCallback(onMidi);
   host.showPopupNotification("Deepmind12 initialized!");
	transport = host.createTransport();
	application = host.createApplication();
   keys = host.getMidiInPort(0).createNoteInput("Keys", "?0????");
   // Notifications:
   host.getNotificationSettings().setShouldShowSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowChannelSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowTrackSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowDeviceSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowDeviceLayerSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowPresetNotifications(true);
   host.getNotificationSettings().setShouldShowMappingNotifications(true);
   host.getNotificationSettings().setShouldShowValueNotifications(true);   
}

function onMidi(status, data1, data2) {
   MS = (new Date()).getMilliseconds();
   NRPN_NUM = (status == 176 && data1 == 98) ? data2 : NRPN_NUM;
   NRPN_VAL = (status == 176 && data1 == 38) ? data2 : NRPN_VAL;
   var NOTE_ON  = (status == 144);
   var NOTE_OFF = (status == 128);
   var NOTE_NUM = (NOTE_ON || NOTE_OFF) ? data1 : 0;
   var NRPN_NEW = (MS != OLD_MS && status == 176 && data1 == 38 && NRPN_NUM);

   if (status != 208) { // IGNORE AFTERTOUCH
      if (NOTE_ON || NOTE_OFF) { // NOTE
         var OCTAVE = (parseInt((NOTE_NUM / 12)) - 1);
         var FREQ   = 0 || (NOTE_NUM > 0 && NOTE_NUM < 128) ? Math.pow(2, (NOTE_NUM - 69) / 12) * 440 : null
         var PITCH  = CHROMATIC[NOTE_NUM % 12] + OCTAVE;
         var LETTER = PITCH.slice(0, 1);
         host.println("NOTE: " + NOTE_NUM + ", OCTAVE: " + OCTAVE + ", NOTE: " + LETTER + ", PITCH: " + PITCH + ", FREQUENCY: " + parseInt(FREQ));
      } else if (typeof(CC_MAP[data1]) != 'undefined') { // CC
         CONTROLLER = CC_MAP[data1];
         host.println("CC: CONTROLLER: " + CONTROLLER + "(" + data1 + ")=" + data2);
      }
      if (NRPN_NEW) { // NRPN
         CONTROLLER = NRPN_NUMS[NRPN_NUM];
         SWITCH = (NRPN_VAL == 0) ? 'OFF' : 'ON';
         println("NRPN: CONTROLLER: " + CONTROLLER + "=" + SWITCH);
         OLD_MS = MS;
         NRPN_NUM = 0;
         NRPN_VAL = 0;
      } 
   }
}

function exit() { }