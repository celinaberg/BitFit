import java.util.Scanner;

public class Test {
    public static void main(String[] args) {
        System.out.println("Hello arky's World !");
        sum(3,13);
        Scanner s = new Scanner(System.in);
        int j = s.nextInt();
        System.out.println("here's j: " + j);
    }
    
    public static void sum(int a, int b) {
        System.out.println(a + b);
    }
}
