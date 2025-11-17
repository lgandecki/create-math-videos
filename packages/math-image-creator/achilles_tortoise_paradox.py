from manim import *

class AchillesTortoiseParadox(Scene):
    def construct(self):
        # Title
        title = Text("Paradoks Zenona: Achilles i Żółw", font_size=36, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create race track
        track = Line(start=LEFT*6, end=RIGHT*6, color=WHITE, stroke_width=8)
        track.shift(DOWN*1.5)
        
        # Position markers
        start_marker = Line(LEFT*6 + UP*0.3 + DOWN*1.5, LEFT*6 + DOWN*0.3 + DOWN*1.5, color=WHITE)
        tortoise_start_marker = Line(LEFT*2 + UP*0.3 + DOWN*1.5, LEFT*2 + DOWN*0.3 + DOWN*1.5, color=GREEN)
        
        # Labels for positions
        zero_label = Text("0m", font_size=20, color=WHITE).next_to(start_marker, DOWN, buff=0.2)
        hundred_label = Text("100m", font_size=20, color=GREEN).next_to(tortoise_start_marker, DOWN, buff=0.2)
        
        self.play(Create(track))
        self.play(Create(start_marker), Create(tortoise_start_marker))
        self.play(Write(zero_label), Write(hundred_label))
        
        # Create Achilles (red circle) and Tortoise (green circle)
        achilles = Circle(radius=0.3, color=RED, fill_opacity=1)
        achilles.move_to(LEFT*6 + DOWN*1.5)
        achilles_label = Text("Achilles", font_size=16, color=RED).next_to(achilles, UP, buff=0.2)
        
        tortoise = Circle(radius=0.25, color=GREEN, fill_opacity=1)
        tortoise.move_to(LEFT*2 + DOWN*1.5)
        tortoise_label = Text("Żółw", font_size=16, color=GREEN).next_to(tortoise, UP, buff=0.2)
        
        self.play(FadeIn(achilles), FadeIn(tortoise))
        self.play(Write(achilles_label), Write(tortoise_label))
        self.wait(1)
        
        # Introduction text
        intro_text = Text("Żółw ma przewagę 100m. Czy Achilles go dogoni?", 
                         font_size=24, color=YELLOW).to_edge(DOWN)
        self.play(Write(intro_text))
        self.wait(2)
        self.play(FadeOut(intro_text))
        
        # Step 1: Achilles runs to where Tortoise began (100m)
        step1_text = Text("Krok 1: Achilles biegnie do punktu 100m", 
                         font_size=24, color=YELLOW).to_edge(DOWN)
        self.play(Write(step1_text))
        
        # Animate Achilles running to 100m, while Tortoise moves to 110m
        new_tortoise_pos = LEFT*1.6 + DOWN*1.5  # 110m position
        
        # Create gap indicator
        gap1 = Line(LEFT*2 + DOWN*1.5, new_tortoise_pos, color=YELLOW, stroke_width=4)
        gap1_label = Text("10m", font_size=18, color=YELLOW).next_to(gap1, UP, buff=0.1)
        
        self.play(
            achilles.animate.move_to(LEFT*2 + DOWN*1.5),
            achilles_label.animate.next_to(LEFT*2 + DOWN*1.5 + UP*0.3, UP, buff=0.2),
            tortoise.animate.move_to(new_tortoise_pos),
            tortoise_label.animate.next_to(new_tortoise_pos + UP*0.3, UP, buff=0.2),
            run_time=2
        )
        
        self.play(Create(gap1), Write(gap1_label))
        
        result1_text = Text("Achilles dotarł do 100m, ale Żółw jest teraz 10m dalej!", 
                           font_size=20, color=RED)
        result1_text.move_to(UP*2)
        self.play(Write(result1_text))
        self.wait(2)
        
        self.play(FadeOut(step1_text), FadeOut(result1_text), FadeOut(gap1), FadeOut(gap1_label))
        
        # Step 2: Achilles runs to where Tortoise was (110m)
        step2_text = Text("Krok 2: Achilles biegnie do punktu 110m", 
                         font_size=24, color=YELLOW).to_edge(DOWN)
        self.play(Write(step2_text))
        
        # Animate Achilles running to 110m, while Tortoise moves to 111m
        new_tortoise_pos2 = LEFT*1.56 + DOWN*1.5  # 111m position
        
        # Create smaller gap indicator
        gap2 = Line(new_tortoise_pos, new_tortoise_pos2, color=YELLOW, stroke_width=4)
        gap2_label = Text("1m", font_size=18, color=YELLOW).next_to(gap2, UP, buff=0.1)
        
        self.play(
            achilles.animate.move_to(new_tortoise_pos),
            achilles_label.animate.next_to(new_tortoise_pos + UP*0.3, UP, buff=0.2),
            tortoise.animate.move_to(new_tortoise_pos2),
            tortoise_label.animate.next_to(new_tortoise_pos2 + UP*0.3, UP, buff=0.2),
            run_time=2
        )
        
        self.play(Create(gap2), Write(gap2_label))
        
        result2_text = Text("Achilles dotarł do 110m, ale Żółw jest teraz 1m dalej!", 
                           font_size=20, color=RED)
        result2_text.move_to(UP*2)
        self.play(Write(result2_text))
        self.wait(2)
        
        self.play(FadeOut(step2_text), FadeOut(result2_text), FadeOut(gap2), FadeOut(gap2_label))
        
        # The Core Idea
        core_text1 = Text("Paradoks głosi: za każdym razem, gdy Achilles dotrze", 
                         font_size=20, color=WHITE)
        core_text2 = Text("do miejsca, gdzie był Żółw, Żółw zdąży się przesunąć dalej!", 
                         font_size=20, color=WHITE)
        core_text3 = Text("Zawsze zostaje JAKAŚ odległość!", 
                         font_size=24, color=RED)
        
        core_group = VGroup(core_text1, core_text2, core_text3).arrange(DOWN, buff=0.3)
        core_group.move_to(UP*2)
        
        self.play(Write(core_text1))
        self.wait(1)
        self.play(Write(core_text2))
        self.wait(1)
        self.play(Write(core_text3))
        self.wait(2)
        
        # Visual demonstration of decreasing gaps (10:1 ratio)
        self.play(FadeOut(core_group))
        
        gap_series_text = Text("Kolejne luki w stosunku 10:1 maleją w nieskończoność!", 
                           font_size=20, color=YELLOW).to_edge(DOWN)
        self.play(Write(gap_series_text))
        
        # Create shrinking line segments showing correct 10:1 ratio
        distances = [10, 1, 0.1, 0.01, 0.001]
        distance_labels = ["10m", "1m", "0.1m", "0.01m", "0.001m", "..."]
        
        # Start with a line representing 10m
        demo_line = Line(LEFT*2, RIGHT*2, color=YELLOW, stroke_width=6)
        demo_line.move_to(UP*1)
        demo_label = Text("10m", font_size=20, color=YELLOW).next_to(demo_line, UP)
        
        self.play(Create(demo_line), Write(demo_label))
        self.wait(1)
        
        # Animate halving
        current_line = demo_line
        current_label = demo_label
        
        for i, (distance, label) in enumerate(zip(distances[1:], distance_labels[1:-1])):
            new_length = current_line.get_length() / 10  # Divide by 10, not 2
            new_line = Line(current_line.get_start(), 
                           current_line.get_start() + RIGHT * new_length, 
                           color=YELLOW, stroke_width=6)
            new_line.move_to(current_line.get_center())
            
            new_label = Text(label, font_size=20, color=YELLOW).next_to(new_line, UP)
            
            self.play(
                Transform(current_line, new_line),
                Transform(current_label, new_label),
                run_time=1
            )
            self.wait(0.5)
        
        # Show infinite continuation
        infinite_label = Text("...", font_size=24, color=YELLOW).next_to(current_line, RIGHT)
        self.play(Write(infinite_label))
        
        # Final paradox statement
        final_text = Text("Nigdy nie osiągnie zera!", font_size=24, color=RED)
        final_text.move_to(DOWN*0.5)
        self.play(Write(final_text))
        
        self.wait(3)
        
        # Clean up for conclusion
        self.play(
            *[FadeOut(mob) for mob in self.mobjects]
        )
        
        # Resolution
        resolution_title = Text("Rozwiązanie Paradoksu", font_size=32, color=GREEN)
        resolution_title.to_edge(UP)
        
        resolution_text1 = Text("W rzeczywistości Achilles dogania Żółwia w określonym czasie!", 
                               font_size=20, color=WHITE)
        resolution_text2 = Text("Suma nieskończonej serii: 10 + 1 + 0.1 + 0.01 + ... = 11.11...m", 
                               font_size=18, color=BLUE)
        resolution_text3 = Text("Paradoks wynika z błędnego myślenia o czasie i przestrzeni.", 
                               font_size=18, color=YELLOW)
        
        resolution_group = VGroup(resolution_text1, resolution_text2, resolution_text3)
        resolution_group.arrange(DOWN, buff=0.5).move_to(ORIGIN)
        
        self.play(Write(resolution_title))
        self.wait(1)
        self.play(Write(resolution_text1))
        self.wait(1)
        self.play(Write(resolution_text2))
        self.wait(1)
        self.play(Write(resolution_text3))
        self.wait(3)