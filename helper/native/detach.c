#include <unistd.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include "lock.h"
int main(int argc,char**argv){int lock=acquire_lock("/media/developer/apps/usr/palm/applications/com.mbs.communityhomehelper/state/controller.lock");if(lock<0)return 0;pid_t p=fork();if(p<0)return 1;if(p>0)return 0;setsid();setenv("NODE_PATH","/usr/lib/nodejs:/usr/lib/node_modules",1);int fd=open("/media/developer/apps/usr/palm/applications/com.mbs.communityhomehelper/state/bootstrap.log",O_WRONLY|O_APPEND|O_CREAT,0660);if(fd>=0)dprintf(fd,"BOOTSTRAP uid=%d pid=%d\n",getuid(),getpid());if(fd>=0){dup2(fd,0);dup2(fd,1);dup2(fd,2);if(fd>2)close(fd);}execl("/usr/bin/node","node","/media/developer/apps/usr/palm/applications/com.mbs.communityhomehelper/controller.js",argc>1?argv[1]:"{}",(char*)0);_exit(2);}
