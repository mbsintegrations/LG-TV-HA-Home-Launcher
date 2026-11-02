#include "filter.h"
#include "device-config.h"
#include <assert.h>
#include <stdio.h>
int main(void){
 struct filter f={0};struct ev e={0,0,1,HOME_KEY,1};assert(sizeof e==16);
 assert(filter_event(&f,&e,100)==OPEN_HOME);
 e.value=2;assert(filter_event(&f,&e,200)==DROP);
 assert(!filter_timeout(&f,2099));assert(filter_timeout(&f,2100));
 e.value=0;assert(filter_event(&f,&e,2200)==DROP);assert(!filter_timeout(&f,5000));
 /* Release queued behind scheduling or missing from the userspace stream. */
 e.value=1;assert(filter_event(&f,&e,6000)==OPEN_HOME);
 assert(filter_timeout(&f,8500));assert(!filter_confirm_hold(&f,0,8500));
 assert(!filter_timeout(&f,12000));
 /* The next short press still works and an actual hold still escapes. */
 assert(filter_event(&f,&e,13000)==OPEN_HOME);
 assert(!filter_confirm_hold(&f,1,14999));assert(filter_confirm_hold(&f,1,15000));
 assert(!filter_confirm_hold(&f,1,15100));
 e.value=0;assert(filter_event(&f,&e,15001)==DROP);
 unsigned codes[]={28,103,105,106,108,412,114,115,116,1198,1199,2,398};
 for(unsigned i=0;i<sizeof codes/sizeof codes[0];i++)for(int v=0;v<3;v++){e.type=1;e.code=codes[i];e.value=v;assert(filter_event(&f,&e,6000)==PASS);}
 e.type=3;e.code=773;assert(filter_event(&f,&e,6000)==PASS);
 e.type=2;e.code=8;assert(filter_event(&f,&e,6000)==PASS);
 e.type=0;e.code=0;assert(filter_event(&f,&e,6000)==PASS);
 e.code=3;assert(filter_event(&f,&e,6000)==RELEASE);
 puts("PASS: Home edges, repeats, long press, other keys, pointer, wheel, overflow");
}
