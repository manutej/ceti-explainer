/* trace.c · same physics as ../verlet_vs_rk4.c (unit G*M = 1, Earth-shaped orbit, start at perihelion),
   but prints N log-spaced checkpoints so recompute.py can build the dot cloud.
   usage: trace e steps_per_orbit total_steps n_checkpoints mode   (mode 0 velocity Verlet, 1 classical RK4)
   output: one CSV row per checkpoint: step,orbits,x,y,vx,vy,dE_rel,dL_rel,a_ratio  (a_ratio = semi-major axis / start value) */
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
static double E(double*s){double r=sqrt(s[0]*s[0]+s[1]*s[1]);return 0.5*(s[2]*s[2]+s[3]*s[3])-1.0/r;}
static double L(double*s){return s[0]*s[3]-s[1]*s[2];}
static void f(const double*s,double*d){double r2=s[0]*s[0]+s[1]*s[1],r3=r2*sqrt(r2);d[0]=s[2];d[1]=s[3];d[2]=-s[0]/r3;d[3]=-s[1]/r3;}
int main(int argc,char**argv){
 if(argc<6){fprintf(stderr,"usage\n");return 1;}
 double e=atof(argv[1]); long spo=atol(argv[2]); long n=atol(argv[3]); int nck=atoi(argv[4]); int mode=atoi(argv[5]);
 double h=2*M_PI/spo; double s[4]={1-e,0,0,sqrt((1+e)/(1-e))};
 double E0=E(s),L0=L(s); double a0=-1.0/(2*E0);
 long next=1; int k=0; double ratio=pow((double)n,1.0/(nck-1)); /* checkpoints at ceil(ratio^k) */
 long ck[100000]; for(k=0;k<nck;k++){long v=(long)ceil(pow((double)n,(double)k/(nck-1))); if(k>0&&v<=ck[k-1])v=ck[k-1]+1; if(v>n)v=n; ck[k]=v;}
 k=0; (void)next;(void)ratio;
 printf("step,orbits,x,y,vx,vy,dE_rel,dL_rel,a_ratio\n");
 for(long i=1;i<=n;i++){
  if(mode==0){
   double r2=s[0]*s[0]+s[1]*s[1],r3=r2*sqrt(r2);
   s[2]+=-0.5*h*s[0]/r3;s[3]+=-0.5*h*s[1]/r3; s[0]+=h*s[2];s[1]+=h*s[3];
   r2=s[0]*s[0]+s[1]*s[1];r3=r2*sqrt(r2); s[2]+=-0.5*h*s[0]/r3;s[3]+=-0.5*h*s[1]/r3;
  } else {
   double k1[4],k2[4],k3[4],k4[4],t[4];int j;
   f(s,k1);for(j=0;j<4;j++)t[j]=s[j]+0.5*h*k1[j];
   f(t,k2);for(j=0;j<4;j++)t[j]=s[j]+0.5*h*k2[j];
   f(t,k3);for(j=0;j<4;j++)t[j]=s[j]+h*k3[j];
   f(t,k4);for(j=0;j<4;j++)s[j]+=h/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]);
  }
  while(k<nck && i==ck[k]){
   double En=E(s); double a=(En<0)?-1.0/(2*En):NAN;
   printf("%ld,%.6f,%.9e,%.9e,%.9e,%.9e,%.9e,%.9e,%.9e\n",i,(double)i/spo,s[0],s[1],s[2],s[3],(En-E0)/E0,(L(s)-L0)/L0,a/a0);
   k++;
  }
 }
 return 0;
}
