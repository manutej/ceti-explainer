#include <stdio.h>
#include <math.h>
#include <stdlib.h>
static double E(double*s){double r=sqrt(s[0]*s[0]+s[1]*s[1]);return 0.5*(s[2]*s[2]+s[3]*s[3])-1.0/r;}
static double L(double*s){return s[0]*s[3]-s[1]*s[2];}
static void f(const double*s,double*d){double r2=s[0]*s[0]+s[1]*s[1],r3=r2*sqrt(r2);d[0]=s[2];d[1]=s[3];d[2]=-s[0]/r3;d[3]=-s[1]/r3;}
int main(int argc,char**argv){
 double e=atof(argv[1]); long spo=atol(argv[2]); long norb=atol(argv[3]); int mode=atoi(argv[4]);
 double h=2*M_PI/spo; double s[4]={1-e,0,0,sqrt((1+e)/(1-e))};
 double E0=E(s),L0=L(s),maxE=0,maxL=0; long n=spo*norb; long ck=n/10;
 for(long i=1;i<=n;i++){
  if(mode==0){ // velocity verlet KDK
   double r2=s[0]*s[0]+s[1]*s[1],r3=r2*sqrt(r2);
   s[2]+=-0.5*h*s[0]/r3;s[3]+=-0.5*h*s[1]/r3;
   s[0]+=h*s[2];s[1]+=h*s[3];
   r2=s[0]*s[0]+s[1]*s[1];r3=r2*sqrt(r2);
   s[2]+=-0.5*h*s[0]/r3;s[3]+=-0.5*h*s[1]/r3;
  } else {
   double k1[4],k2[4],k3[4],k4[4],t[4];int j;
   f(s,k1);for(j=0;j<4;j++)t[j]=s[j]+0.5*h*k1[j];
   f(t,k2);for(j=0;j<4;j++)t[j]=s[j]+0.5*h*k2[j];
   f(t,k3);for(j=0;j<4;j++)t[j]=s[j]+h*k3[j];
   f(t,k4);for(j=0;j<4;j++)s[j]+=h/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]);
  }
  if(i%ck==0||i%spo==0&&i<=spo*100){double de=fabs((E(s)-E0)/E0),dl=fabs((L(s)-L0)/L0); if(de>maxE)maxE=de; if(dl>maxL)maxL=dl;
   if(i%ck==0)printf("steps=%ld orbits=%ld dE/E=%.3e dL/L=%.3e\n",i,i/spo,(E(s)-E0)/E0,(L(s)-L0)/L0);}
 }
 printf("max|dE/E| at checkpoints=%.3e  max|dL/L|=%.3e\n",maxE,maxL);
}
