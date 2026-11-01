#include "filter.h"
#include "device-config.h"
int filter_event(struct filter*f,const struct ev*e,uint64_t now){
 if(e->type==0&&e->code==3)return RELEASE;
 if(e->type!=1||e->code!=HOME_KEY)return PASS;
 if(e->value==0){f->home=0;f->hold_reported=0;return DROP;}
 if(e->value==1&&!f->home){f->home=1;f->since=now;return OPEN_HOME;}
 return DROP;
}
int filter_timeout(const struct filter*f,uint64_t now){return f->home&&now-f->since>=2000;}
/* A queued or missing release must not turn a short press into a long hold. */
int filter_confirm_hold(struct filter*f,int physically_down,uint64_t now){
 if(!physically_down){f->home=0;f->hold_reported=0;return 0;}
 if(filter_timeout(f,now)&&!f->hold_reported){f->hold_reported=1;return 1;}
 return 0;
}
