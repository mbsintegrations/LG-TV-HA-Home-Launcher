#include <stdint.h>
struct ev {uint32_t sec,usec;uint16_t type,code;int32_t value;};
struct filter {int home;uint64_t since;int hold_reported;};
enum action {PASS,OPEN_HOME,DROP,RELEASE};
int filter_event(struct filter*,const struct ev*,uint64_t);
int filter_timeout(const struct filter*,uint64_t);
int filter_confirm_hold(struct filter*,int,uint64_t);
