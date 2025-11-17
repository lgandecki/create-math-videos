from manim import *

class HelloManim(Scene):
    def construct(self):
        # Create the main title
        title = Text("Hello Manim: Your First Visualization", font_size=48, color=WHITE)
        title.to_edge(UP, buff=1)
        
        # Create introduction text about "Hello World"
        intro_text1 = Text(
            "Introduce the concept of \"Hello World\"",
            font_size=32,
            color=WHITE
        )
        intro_text1.shift(UP * 1.5)
        
        intro_text2 = Text(
            "as the traditional first program",
            font_size=32,
            color=WHITE
        )
        intro_text2.next_to(intro_text1, DOWN, buff=0.3)
        
        intro_text3 = Text(
            "when learning a new system.",
            font_size=32,
            color=WHITE
        )
        intro_text3.next_to(intro_text2, DOWN, buff=0.3)
        
        # Create explanation about math visualization
        explanation1 = Text(
            "For math visualization,",
            font_size=28,
            color=YELLOW
        )
        explanation1.shift(DOWN * 0.5)
        
        explanation2 = Text(
            "this means getting simple text onto the screen,",
            font_size=28,
            color=YELLOW
        )
        explanation2.next_to(explanation1, DOWN, buff=0.3)
        
        explanation3 = Text(
            "marking the beginning of bringing mathematical ideas to life.",
            font_size=28,
            color=YELLOW
        )
        explanation3.next_to(explanation2, DOWN, buff=0.3)
        
        # Animation sequence
        self.play(Write(title), run_time=2)
        self.wait(1)
        
        self.play(
            Write(intro_text1),
            Write(intro_text2),
            Write(intro_text3),
            run_time=3
        )
        self.wait(2)
        
        self.play(
            Write(explanation1),
            Write(explanation2),
            Write(explanation3),
            run_time=3
        )
        self.wait(2)
        
        # Final emphasis on the title
        self.play(
            title.animate.set_color(GREEN).scale(1.1),
            run_time=1.5
        )
        self.wait(2)