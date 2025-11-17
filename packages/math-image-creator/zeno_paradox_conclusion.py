from manim import *

class ZenoParadoxConclusion(Scene):
    def construct(self):
        # Title
        title = Text("Zeno's Paradoxes - Conclusion", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create dividing line for side-by-side display
        divider = Line(start=UP*3, end=DOWN*3, color=GRAY)
        self.play(Create(divider))
        
        # Left side: "Never reaching" paradox
        left_title = Text("Achilles and the Tortoise", font_size=24, color=GREEN)
        left_title.shift(LEFT*3 + UP*2)
        
        # Right side: "Frozen arrow" paradox  
        right_title = Text("Arrow Paradox", font_size=24, color=RED)
        right_title.shift(RIGHT*3 + UP*2)
        
        self.play(Write(left_title), Write(right_title))
        self.wait(1)
        
        # Left side: Person trying to reach wall
        wall_left = Rectangle(height=3, width=0.2, color=BLUE, fill_opacity=1)
        wall_left.shift(LEFT*1 + DOWN*0.5)
        
        person = Circle(radius=0.2, color=GREEN, fill_opacity=1)
        person.shift(LEFT*5 + DOWN*0.5)
        
        # Right side: Arrow in flight
        arrow_start = LEFT*1 + DOWN*0.5
        arrow_end = RIGHT*5 + DOWN*0.5
        arrow = Arrow(start=ORIGIN, end=RIGHT*0.5, color=RED)
        arrow.shift(arrow_start)
        
        target = Circle(radius=0.3, color=YELLOW, fill_opacity=0.3)
        target.shift(arrow_end)
        
        self.play(Create(wall_left), Create(person), Create(arrow), Create(target))
        self.wait(1)
        
        # Show the paradoxes in action
        # Left: Person gets halfway, then halfway again, etc.
        distances = [2, 1, 0.5, 0.25]
        for i, dist in enumerate(distances):
            self.play(person.animate.shift(RIGHT*dist), run_time=0.8)
            if i < len(distances) - 1:
                # Show getting stuck
                self.play(person.animate.scale(0.9).set_color(ORANGE), run_time=0.3)
                self.play(person.animate.scale(1/0.9).set_color(GREEN), run_time=0.3)
        
        # Right: Arrow appears frozen
        for _ in range(4):
            self.play(arrow.animate.set_color(ORANGE), run_time=0.3)
            self.play(arrow.animate.set_color(RED), run_time=0.3)
        
        self.wait(1)
        
        # First explanatory text
        explanation1 = Text("Zeno's paradoxes highlight the difficulties of\nunderstanding infinity and continuous motion.", 
                           font_size=32, color=WHITE)
        explanation1.shift(DOWN*2.5)
        self.play(Write(explanation1))
        self.wait(3)
        
        # Clear and introduce calculus
        self.play(FadeOut(explanation1))
        
        calculus_intro = Text("Mathematics, particularly calculus, resolves these paradoxes", 
                             font_size=28, color=BLUE)
        calculus_intro.shift(DOWN*2)
        
        calculus_detail = Text("by showing how infinite sums can converge to a finite value,\nand how motion is continuous change, not static snapshots.", 
                              font_size=24, color=WHITE)
        calculus_detail.shift(DOWN*3)
        
        self.play(Write(calculus_intro))
        self.wait(1)
        self.play(Write(calculus_detail))
        self.wait(3)
        
        # Clear explanations
        self.play(FadeOut(calculus_intro), FadeOut(calculus_detail))
        
        # Show resolution: smooth motion
        resolution_text = Text("Motion is real, and the journey does end!", 
                              font_size=36, color=YELLOW)
        resolution_text.shift(DOWN*2.5)
        
        # Person finally reaches the wall smoothly
        remaining_distance = wall_left.get_center()[0] - person.get_center()[0] - 0.4
        self.play(
            person.animate.shift(RIGHT*remaining_distance).set_color(BLUE),
            Write(resolution_text),
            run_time=2
        )
        
        # Arrow completes its flight smoothly
        arrow_distance = target.get_center()[0] - arrow.get_center()[0] - 0.3
        self.play(
            arrow.animate.shift(RIGHT*arrow_distance).set_color(BLUE),
            run_time=2
        )
        
        # Final celebration effect
        self.play(
            person.animate.scale(1.2).set_color(GREEN),
            arrow.animate.scale(1.2),
            target.animate.scale(1.3).set_color(GOLD),
            run_time=1
        )
        
        self.wait(2)
        
        # Fade everything out
        self.play(FadeOut(*self.mobjects))
        self.wait(1)