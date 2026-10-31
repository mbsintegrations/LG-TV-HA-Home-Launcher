'use strict';
// A long scheduling gap is evidence of suspension, not proof of its cause.
// Ordinary crashes, user pauses and trials require an explicit resume.
exports.allowed=function(control,report,now){
 var exit=report.exit||{};
 return !!(control.enabled&&!control.paused&&report.released&&exit.recoverable===true&&
  !exit.signal&&(exit.code===20||exit.code===0)&&
  typeof exit.suspensionGapMs==='number'&&isFinite(exit.suspensionGapMs)&&exit.suspensionGapMs>=10000&&
  (!control.lastRecoveryAt||now-control.lastRecoveryAt>=300000));
};
