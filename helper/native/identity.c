#include <unistd.h>
#include <stdio.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <string.h>
#include "device-config.h"
#define BIT(ev,len) _IOC(_IOC_READ,'E',0x20+(ev),len)
#define NAME(len) _IOC(_IOC_READ,'E',0x06,len)
/* No input grab and no input-event writes. Output only contains identity/capability results. */
static int find(const char *wanted,int flags){for(int i=0;i<32;i++){char p[64],name[256]={0};snprintf(p,sizeof p,"/dev/input/event%d",i);int fd=open(p,flags|O_NONBLOCK);if(fd<0)continue;if(ioctl(fd,NAME(sizeof name),name)>=0&&!strcmp(name,wanted))return fd;close(fd);}return -1;}
int main(void){
 FILE *f=fopen("/media/developer/apps/usr/palm/applications/com.mbs.communityhomehelper/state/identity.json","w");if(!f)return 2;
 int a=find(SOURCE_NAME,O_RDONLY),b=find(DESTINATION_NAME,O_RDWR),ok=a>=0&&b>=0;
 for(int i=0;i<4&&ok;i++){unsigned char x[256]={0},y[256]={0};ok=ioctl(a,BIT(i,256),x)>=0&&ioctl(b,BIT(i,256),y)>=0&&!memcmp(x,y,256);}
 for(int i=0;i<2&&ok;i++){int x[6],y[6];ok=ioctl(a,_IOR('E',0x40+i,int[6]),x)>=0&&ioctl(b,_IOR('E',0x40+i,int[6]),y)>=0&&!memcmp(x+1,y+1,5*sizeof(int));}
 fprintf(f,"{\"uid\":%d,\"gid\":%d,\"compatible\":%s,\"inputGrabbed\":false,\"eventsWritten\":0}\n",getuid(),getgid(),ok?"true":"false");fclose(f);if(a>=0)close(a);if(b>=0)close(b);return ok?0:3;
}
