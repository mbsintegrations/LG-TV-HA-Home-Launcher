#include <fcntl.h>
#include <sys/file.h>
#include <unistd.h>
static int acquire_lock(const char*path){int fd=open(path,O_RDWR|O_CREAT,0660);if(fd<0)return -1;if(flock(fd,LOCK_EX|LOCK_NB)<0){close(fd);return -1;}return fd;}
